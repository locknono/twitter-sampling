import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";
import * as d3 from "d3";
import * as cloud from "d3-cloud";
import { setData, CLOUD_DATA } from "../actions/setDataAction";
import { setCurTopic } from "../actions/setUIState";
import { connect } from "react-redux";
import { color, maxCloudWordSize } from "src/constants";
import { useWidthAndHeight } from "src/hooks/layoutHooks";
interface Props {
  cloudData: CloudData;
  curTopic: CurTopic;
  setData: typeof setData;
  setCurTopic: typeof setCurTopic;
}
const mapState = (state: any) => {
  const { cloudData } = state.dataTree;
  const { curTopic } = state.uiState;
  return { cloudData, curTopic };
};
const mapDispatch = {
  setData,
  setCurTopic
};

function WordCloud(props: Props) {
  const { cloudData, curTopic, setData, setCurTopic } = props;
  const [width, height] = useWidthAndHeight("cloud-svg");
  const [cloudLayout, setCloudLayout] = React.useState<any | undefined>(
    undefined
  );
  const [layoutWords, setLayoutWords] = React.useState<any | undefined>(
    undefined
  );

  React.useEffect(() => {
    (async function fetchData() {
      const res = await fetch("./allWordCloudData.json");
      const data: CloudData = await res.json();

      const logFunc = Math.log10;
      for (let i = 0; i < data.length; i++) {
        const curTopicWords = data[i];
        let maxFre = -1;
        let minFre = Number.MAX_SAFE_INTEGER;
        for (let j = 0; j < curTopicWords.length; j++) {
          if (logFunc(curTopicWords[j].fre) > maxFre) {
            maxFre = logFunc(curTopicWords[j].fre);
          }
          if (logFunc(curTopicWords[j].fre) < minFre) {
            minFre = logFunc(curTopicWords[j].fre);
          }
        }
        const fontSizeScale = d3
          .scaleLinear()
          .domain([minFre, maxFre])
          .range([0, maxCloudWordSize])
          .clamp(true);
        for (let j = 0; j < curTopicWords.length; j++) {
          curTopicWords[j].size = fontSizeScale(logFunc(curTopicWords[j].fre));
        }
      }

      setData(CLOUD_DATA, data);
    })();
  }, []);

  //initialize cloud layout
  React.useEffect(() => {
    if (!width || !height) return;
    if (cloudLayout !== undefined || !cloudData) return;
    let topicIndex;
    if (curTopic === undefined) {
      topicIndex = 10;
    } else {
      topicIndex = curTopic;
    }

    const layout = cloud()
      .size([width, height])
      /**
       * the cloud layout would change the property of `words` we pass in,
       * so pass a copy instead of passing the words
       */
      .words(JSON.parse(JSON.stringify(cloudData[topicIndex])))

      .padding(0.5)
      /* .rotate(function() {
        return ~~(Math.random() * 2) * 90;
      }) */
      .font("Impact")
      .fontSize(function(d) {
        return d.size as number;
      })
      .on("end", function(words) {
        setCloudLayout(layout);
        setLayoutWords(words);
      });
    layout.start();
  });

  React.useEffect(() => {
    let topicIndex;
    if (curTopic === undefined) {
      topicIndex = 10;
    } else {
      topicIndex = curTopic;
    }
    if (!cloudLayout || curTopic === undefined) return;
    cloudLayout.words(JSON.parse(JSON.stringify(cloudData[topicIndex])));
    cloudLayout.start();
  }, [curTopic]);

  let renderWords;
  let renderGroup;
  if (layoutWords) {
    renderWords = layoutWords.map((e: any, i: number) => {
      return (
        <text
          key={`${e.text}-${e.x}-${e.y}`}
          textAnchor="middle"
          transform={"translate(" + [e.x, e.y] + ")rotate(" + e.rotate + ")"}
          style={{
            fontSize: e.size,
            fontFamily: "Impact",
            fill: color.cloudColors[i % color.cloudColors.length]
          }}
        >
          {e.text}
        </text>
      );
    });
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
