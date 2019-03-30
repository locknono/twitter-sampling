import * as React from "react";
import { useState } from "react";

import * as echarts from "echarts";
import Heading from "./Heading";
import {
  setData,
  RIVER_DATA,
  SAMPLING_RIVER_DATA
} from "../actions/setDataAction";
import { connect } from "react-redux";
import { fetchJsonData } from "src/shared";
import { topicNumber, url } from "src/constants/constants";
import { color } from "../constants/constants";
import { createRiverOption } from "src/constants/riverOptions";
import { SAMPLING_CONDITION } from "src/actions/setUIState";
import { getURLBySamplingCondition } from "src/shared/fetch";

const mapState = (state: any) => {
  const { riverData, samplingRiverData } = state.dataTree;
  const { curTopic, samplingFlag, samplingCondition } = state.uiState;
  return {
    riverData,
    curTopic,
    samplingFlag,
    samplingRiverData,
    samplingCondition
  };
};
const mapDispatch = {
  setData
};

interface Props {
  riverData: [string, number, string][];
  samplingRiverData: [string, number, string][];
  curTopic: CurTopic;
  setData: typeof setData;
  samplingFlag: boolean;
  samplingCondition: SAMPLING_CONDITION;
}
function StackBar(props: Props) {
  const {
    riverData,
    samplingRiverData,
    curTopic,
    setData,
    samplingFlag,
    samplingCondition
  } = props;

  const [chart, setChart] = React.useState();

  React.useEffect(() => {
    fetchJsonData(url.riverDataURL)
      .then(data => {
        setData(RIVER_DATA, data);
      })
      .then(function() {
        return fetchJsonData(
          getURLBySamplingCondition(url.samplingRiverDataURL, samplingCondition)
        );
      })
      .then(data => {
        setData(SAMPLING_RIVER_DATA, data);
      });
  }, [samplingCondition]);

  React.useEffect(() => {
    if (!samplingRiverData || !riverData) return;

    const diffRiverData: [string, number, string][] = [];
    for (let i = 0; i < riverData.length; i++) {
      const date = riverData[i][0];
      const value = riverData[i][1];
      const topic = riverData[i][2];
      let diff = -1;
      for (let j = 0; j < samplingRiverData.length; j++) {
        if (
          samplingRiverData[j][0] === date &&
          samplingRiverData[j][2] === topic
        ) {
          diff = value - samplingRiverData[j][1];
        }
      }
      if (diff === -1) {
        diff = value;
      }
      diffRiverData.push([date, diff, topic]);
    }
    const myChart = echarts.init(document.getElementById(
      "stack-bar"
    ) as HTMLDivElement);
    const option = createRiverOption(diffRiverData);
    myChart.on("click", function() {});
    myChart.setOption(option as any);
  }, [samplingRiverData]);

  React.useEffect(() => {}, [riverData]);

  return (
    <div className="stack-bar-div panel panel-default">
      <Heading title="Temporal Difference" />
      <div id="stack-bar" />
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(StackBar);

function getStackData(riverData: [string, number, any][]) {
  for (let i = 0; i < riverData.length; i++) {
    riverData[i][2] = parseInt(riverData[i][2]);
  }
  let minDay = 32;
  let maxDay = -1;
  for (let i = 0; i < riverData.length; i++) {
    const day = parseInt(riverData[i][0].split("/")[2]);
    if (day > maxDay) maxDay = day;
    if (day < minDay) minDay = day;
  }
  const interval = maxDay - minDay + 1;
  const stackData: any[] = [];
  for (let i = 0; i < topicNumber; i++) {
    const everyDayCount: number[] = [];
    for (let j = 0; j < interval; j++) {
      everyDayCount.push(0);
    }
    stackData.push(everyDayCount);
  }
  for (let i = 0; i < riverData.length; i++) {
    const topic = riverData[i][2];
    const day = parseInt(riverData[i][0].split("/")[2]);
    const value = riverData[i][1];
    stackData[topic][day - minDay] += value;
  }
  return stackData;
}
