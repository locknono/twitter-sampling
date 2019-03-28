import { color, topicNumber } from "./constants";

const legends: string[] = [];
for (let i = 0; i < topicNumber; i++) {
  legends.push(i.toString());
}
export const createRiverOption = function(
  riverData: [string, number, string][]
) {
  const option = {
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
    /*     legend: {
      data: legends
    }, */
    singleAxis: {
      top: 10,
      bottom: 20,
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
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      },
      data: riverData
    },
    color: color.nineColors
  };

  return option;
};
