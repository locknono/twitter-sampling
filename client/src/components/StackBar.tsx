import * as React from "react";
import { useState } from "react";

import * as echarts from "echarts";
import Heading from "./Heading";
import { setData, RIVER_DATA } from "../actions/setDataAction";
import { connect } from "react-redux";
import { fetchJsonData } from "src/shared";
import { topicNumber, url } from "src/constants";
import { color } from "../constants";

const mapState = (state: any) => {
  const { riverData } = state.dataTree;
  const { curTopic, samplingFlag } = state.uiState;
  return { riverData, curTopic, samplingFlag };
};
const mapDispatch = {
  setData
};

interface Props {
  riverData: [string, number, string][];
  curTopic: CurTopic;
  setData: typeof setData;
  samplingFlag: boolean;
}
function StackBar(props: Props) {
  const { riverData, curTopic, setData, samplingFlag } = props;

  const [originalRiverData, setOriginalRiverData] = React.useState();
  const [samplingRiverData, setSamplingRiverData] = React.useState();
  const [chart, setChart] = React.useState();

  React.useEffect(() => {
    fetchJsonData(url.riverDataURL)
      .then(data => {
        setOriginalRiverData(data);
      })
      .then(function() {
        return fetchJsonData(url.samplingRiverDataURL);
      })
      .then(data => {
        setSamplingRiverData(data);
      });
  }, []);

  React.useEffect(() => {
    const fetchURL =
      samplingFlag === true ? url.samplingRiverDataURL : url.riverDataURL;
    fetchJsonData(fetchURL).then(data => {
      console.log("data: ", data);
      setData(RIVER_DATA, data);
      if (samplingFlag === false) {
        setOriginalRiverData(data);
      } else {
        setSamplingRiverData(data);
      }
    });
  }, [samplingFlag]);

  React.useEffect(() => {
    if (!samplingRiverData || !originalRiverData) return;
    const days: string[] = Array.from(
      new Set(
        originalRiverData.map((e: [string]) => {
          return `${e[0].split("/")[1]}-${e[0].split("/")[2]}`;
        })
      )
    );
    days.sort((a, b) => {
      return parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]);
    });
    const s1 = getStackData(originalRiverData);
    const s2 = getStackData(samplingRiverData);
    const stackData = [];
    for (let i = 0; i < s1.length; i++) {
      const stackObj: {
        [index: string]: any;
      } = {
        name: days[i],
        type: "bar",
        stack: "总量",
        data: []
      };
      for (let j = 0; j < s1[i].length; j++) {
        stackObj.data.push(s1[i][j] - s2[i][j]);
      }
      stackData.push(stackObj);
    }

    stackData.sort((a, b) => {
      return parseInt(a.name.split("-")[1]) - parseInt(b.name.split("-")[1]);
    });
    console.log("stackData: ", stackData);
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        top: "10px",
        left: "10px",
        right: "10px",
        bottom: "5px",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: days,
        margin: 0
      },
      yAxis: {
        type: "value"
      },
      series: stackData,
      color: color.nineColors
    };

    chart.on("click", function() {});
    chart.setOption(option as any);
  }, [samplingRiverData]);

  React.useEffect(() => {
    if (!riverData) return;
    const myChart = echarts.init(document.getElementById(
      "stack-bar"
    ) as HTMLDivElement);
    setChart(myChart);
  }, [riverData]);

  return (
    <div className="stack-bar-div panel panel-default">
      <Heading title="stack bars" />
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
