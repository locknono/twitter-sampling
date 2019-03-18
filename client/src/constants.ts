import * as d3 from "d3";

export const topicNumber = 9;
/**nine categorical colors */
export const colorScale = d3.scaleOrdinal(d3.schemeSet1);

export namespace padding {
  export const barChartPadding = 0.1;
  export const scatterPadding = 0.08;
}

export namespace color {
  export const originalBarColor = "rgb(13, 157, 255)";
  export const scatterColor = "rgb(13, 157, 255)";
  export const brighterBarColor = (d3.color(originalBarColor) as d3.RGBColor)
    .darker()
    .toString();
  export const nineColors = d3.schemeSet1;
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
  export const mapPointColor = "blue";

  export const selectAreaColoe = "rgba(233, 233, 233, 0.7)";
}

export const scatterRadius = 1.5;

export const maxCloudWordSize = 70;

export const pythonServerURL = "http://localhost:8000/";
