import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";
import * as d3 from "d3";
import * as cloud from "d3-cloud";
import { setData, CLOUD_DATA } from "../actions/setDataAction";
import { setCurTopic } from "../actions/setUIState";
import { connect } from "react-redux";
import { color, maxCloudWordSize, topicNumber, url } from "src/constants";
import { useWidthAndHeight } from "src/hooks/layoutHooks";
interface Props {
  cloudData: CloudData;
  curTopic: CurTopic;
  setData: typeof setData;
  setCurTopic: typeof setCurTopic;
  samplingFlag: boolean;
}
const mapState = (state: any) => {
  const { cloudData } = state.dataTree;
  const { curTopic, samplingFlag } = state.uiState;
  return { cloudData, curTopic, samplingFlag };
};
const mapDispatch = {
  setData,
  setCurTopic
};

function WordCloud(props: Props) {
  const { cloudData, curTopic, setData, setCurTopic, samplingFlag } = props;
  const [width, height] = useWidthAndHeight("cloud-svg");
  const [cloudLayout, setCloudLayout] = React.useState<any | undefined>(
    undefined
  );
  const [layoutWords, setLayoutWords] = React.useState<any | undefined>(
    undefined
  );
  const [lastWords, setLastWords] = React.useState<CloudWord[]>([]);
  const [curWords, setCurWords] = React.useState<CloudWord[]>([]);
  const [lastTopicIndex, setLastTopicIndex] = React.useState<CurTopic>(
    undefined
  );
  const [curTopicIndex, setCurTopicIndex] = React.useState(topicNumber);

  React.useEffect(() => {
    (async function fetchData() {
      let fetchURL =
        samplingFlag === true ? url.samplingCloudDataURL : url.wordCloudDataURL;
      const res = await fetch(fetchURL);
      const data: CloudData = await res.json();
      setData(CLOUD_DATA, data);
    })();
  }, [samplingFlag]);

  //initialize cloud layout
  React.useEffect(() => {
    if (!width || !height || !cloudData) return;
    let topicIndex = curTopic === undefined ? topicNumber : curTopic;
    const layout = cloud()
      .size([width, height])
      .words(JSON.parse(JSON.stringify(cloudData[topicIndex])))
      .padding(0.5)
      .rotate(function() {
        return ~~(Math.random() * 2) * 90;
      })
      .font("Impact")
      .fontSize(function(d) {
        return d.size as number;
      })
      .on("end", function(words) {
        setCloudLayout(layout);
        setLayoutWords(words);
      });
    layout.start();
  }, [cloudData]);

  //select a topic OR select ids
  React.useEffect(() => {
    if (!cloudLayout) return;
    let topicIndex = curTopic === undefined ? topicNumber : curTopic;

    let newWords: CloudWord[];
    if (topicIndex === lastTopicIndex) {
      newWords = [];

      const newWordsSet = new Set();
      lastWords.map(e => {
        if (!newWordsSet.has(e.text)) {
          newWords.push(e);
          newWordsSet.add(e.text);
        }
      });
      cloudData[topicIndex].map(e => {
        if (!newWordsSet.has(e.text)) {
          newWords.push(e);
          newWordsSet.add(e.text);
        }
      });
    } else {
      newWords = JSON.parse(JSON.stringify(cloudData[topicIndex]));
    }
    setCurTopicIndex(topicIndex);
    setCurWords(JSON.parse(JSON.stringify(cloudData[topicIndex])));
    cloudLayout.words(newWords);
    cloudLayout.start();
    return function memoLastWordsAndLastTopic() {
      setLastWords(JSON.parse(JSON.stringify(cloudData[topicIndex])));
      setLastTopicIndex(topicIndex);
    };
  }, [curTopic, cloudData, cloudLayout]);

  let renderWords = [];
  let renderGroup;
  if (layoutWords) {
    const lastWordsSet = new Set();
    const curWordsSet = new Set();
    curWords.map(e => curWordsSet.add(e.text));
    lastWords.map(e => lastWordsSet.add(e.text));

    for (let i = 0; i < layoutWords.length; i++) {
      const e = layoutWords[i];
      const text = layoutWords[i].text;
      let fillColor;
      if (lastTopicIndex === undefined) {
        fillColor = color.currentCloudColor;
      } else if (curTopicIndex !== lastTopicIndex) {
        fillColor = color.currentCloudColor;
      } else {
        if (lastWordsSet.has(text) && curWordsSet.has(text)) {
          fillColor = color.currentCloudColor;
        } else if (!lastWordsSet.has(text) && curWordsSet.has(text)) {
          fillColor = color.extraCloudColor;
        } else if (lastWordsSet.has(text) && !curWordsSet.has(text)) {
          fillColor = color.beforeCloudColor;
        }
      }

      renderWords.push(
        <text
          key={`${e.text}-${e.x}-${e.y}`}
          textAnchor="middle"
          transform={"translate(" + [e.x, e.y] + ")rotate(" + e.rotate + ")"}
          style={{
            fontSize: e.size,
            fontFamily: "Impact",
            fill: fillColor
          }}
        >
          {e.text}
        </text>
      );
    }
  }

  if (cloudLayout) {
    renderGroup = (
      <g
        transform={`translate(${cloudLayout.size()[0] /
          2},${cloudLayout.size()[1] / 2})`}
      >
        {renderWords}
      </g>
    );
  }

  return (
    <div className="word-cloud-div panel panel-default">
      <Heading title="Word Cloud" />
      <svg id="cloud-svg">{renderGroup}</svg>
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(WordCloud);
