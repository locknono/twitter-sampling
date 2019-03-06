import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";
import * as d3 from "d3";
import * as cloud from "d3-cloud";
import { setData, CLOUD_DATA } from "../actions/setDataAction";
import { setCurTopic } from "../actions/setUIState";
import { connect } from "react-redux";

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
  const [width, setWidth] = React.useState<number | undefined>(undefined);
  const [height, setHeight] = React.useState<number | undefined>(undefined);
  const [cloudLayout, setCloudLayout] = React.useState<any | undefined>(
    undefined
  );
  const [layoutWords, setLayoutWords] = React.useState<any | undefined>(
    undefined
  );

  React.useLayoutEffect(() => {
    const w = parseFloat(d3.select("#cloud-svg").style("width"));
    const h = parseFloat(d3.select("#cloud-svg").style("height"));
    setWidth(w);
    setHeight(h);
  });

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch("./allWordCloudData.json");
      const data = await res.json();
      setData(CLOUD_DATA, data);
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    if (!width || !height || curTopic === undefined) return;
    if (cloudLayout !== undefined) return;
    const layout = cloud()
      .size([width, height])
      .words(cloudData[curTopic])

      .padding(1)
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
    if (!cloudLayout || curTopic === undefined) return;
    cloudLayout.words(cloudData[curTopic]);
    cloudLayout.start();
  }, [curTopic]);

  let renderWords;
  let renderGroup;
  if (curTopic !== undefined && layoutWords) {
    renderWords = layoutWords.map((e: any) => {
      return (
        <text
          key={`${e.text}-${e.x}-${e.y}`}
          textAnchor="middle"
          transform={"translate(" + [e.x, e.y] + ")rotate(" + e.rotate + ")"}
          style={{ fontSize: e.size, fontFamily: "Impact" }}
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
      <svg id="cloud-svg">{renderGroup}</svg>
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(WordCloud);
