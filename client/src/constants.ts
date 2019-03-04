import * as d3 from "d3";

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
  export const tenColors = [
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#fdbf6f",
    "#ff7f00",
    "#cab2d6",
    "#6a3d9a"
  ];
}

export const scatterRadius = 1;
