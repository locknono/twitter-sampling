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
function River(props: Props) {
  const { riverData, curTopic, setData, samplingFlag } = props;
  React.useEffect(() => {
    const fetchURL =
      samplingFlag === true ? url.samplingRiverDataURL : url.riverDataURL;
    fetchJsonData(fetchURL).then(data => {
      setData(RIVER_DATA, data);
    });
  }, [samplingFlag]);
  React.useEffect(() => {
    if (!riverData) return;
    const myChart = echarts.init(document.getElementById(
      "river"
    ) as HTMLDivElement);

    const legends = [];
    for (let i = 0; i < topicNumber; i++) {
      legends.push(i.toString());
    }
    var option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line",
          lineStyle: {
            color: "rgba(0,0,0,0.2)",
            width: 1,
            type: "solid"
          }
        }
      },
      legend: {
        data: legends
      },
      singleAxis: {
        top: 50,
        bottom: 50,
        axisTick: {},
        axisLabel: {},
        type: "time",
        axisPointer: {
          animation: true,
          label: {
            show: true
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            opacity: 0.2
          }
        }
      },
      series: {
        type: "themeRiver",
        itemStyle: {
          emphasis: {
            shadowBlur: 20,
            shadowColor: "rgba(0, 0, 0, 0.8)"
          }
        },
        data: riverData
      },
      color: color.nineColors
    };
    myChart.on("click", function() {});
    myChart.setOption(option as any);
  }, [riverData]);

  return (
    <div className="river-view panel panel-default">
      <Heading title="Theme River" />
      <div id="river" />
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(River);
