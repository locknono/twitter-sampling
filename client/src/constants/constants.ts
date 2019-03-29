import * as d3 from "d3";

export const topicNumber = 9;
/**nine categorical colors */
export const colorScale = d3.scaleOrdinal(d3.schemeSet1);

export const mapCircleRadius = 3;
export namespace padding {
  export const barChartPadding = 0.1;
  export const scatterPadding = 0.05;
}

export namespace color {
  export const originalBarColor = "rgb(13, 157, 255)";
  export const scatterColor = "rgb(13, 157, 255)";
  export const brighterBarColor = (d3.color(originalBarColor) as d3.RGBColor)
    .darker()
    .toString();
  export const nineColors = [
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#cab2d6"
  ];
  export const cloudColors = [
    "rgb(13, 157, 255)",
    "rgb(140, 162, 82)",
    "rgb(173, 73, 74)",
    "rgb(107, 110, 207)",
    "rgb(140, 109, 49)",
    "rgb(222, 158, 214)",
    "rgb(206, 219, 156)",
    "rgb(132, 60, 57)",
    "rgb(231, 150, 156)"
  ];
  export const mapPointColor = "black";

  export const selectAreaColoe = "rgba(233, 233, 233, 0.7)";

  export const matrixBorderColor = "rgba(233, 233, 233, 0.5)";

  export const matrixSameColor = "rgb(70,140,200)";

  export const matrixDiffColor = "rgb(238,172,87)";

  export const hexColorScale = d3.interpolateYlOrRd;

  export const originalColor = "rgb(70,140,200)";

  export const samplingColor = "rgb(238,172,87)";

  export const beforeCloudColor = "rgb(222,222,222)";

  export const currentCloudColor = "rgb(54,130,190)";

  export const extraCloudColor = "rgb(238,172,87)";
}

export namespace url {
  export const mapPointsURL = "./mapPoints.json";
  export const samplingMapPointsURL = "./samplingMapPoints.json";
  export const ldbrPointsURL = "./samplingMapPoints.json";
  export const riverDataURL = "./riverData.json";
  export const samplingRiverDataURL = "./samplingRiverData.json";
  export const scatterPointsURL = "./scatterPoints.json";
  export const samplingScatterPointsURL = "./samplingScatterPoints.json";
  export const scatterCentersURL = "./scatterCenters.json";
  export const wordCloudDataURL = "./allWordCloudData.json";
  export const samplingCloudDataURL = "./samplingCloudData.json";
  export const barDataURL = "./barData.json";
  export const hexURL = "./hex.json";
  export const heatURL = "./heatData.json";
  export const samplingHeatURL = "./samplingHeatData.json";
}

export const scatterRadius = 1.5;

export const maxCloudWordSize = 70;

export const pythonServerURL = "http://localhost:8000/";

export const wheelLayerHeight = 10;
