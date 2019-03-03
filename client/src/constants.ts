import * as d3 from "d3";

/**nine categorical colors */
export const colorScale = d3.scaleOrdinal(d3.schemeSet1);

export namespace padding {
  export const barChartPadding = 0.1;
  export const scatterPadding = 0.1;
}

export namespace color {
  export const originalBarColor = "rgb(13, 157, 255)";
  export const scatterColor = "rgb(13, 157, 255)";
  export const brighterBarColor = (d3.color(originalBarColor) as d3.RGBColor)
    .darker()
    .toString();
}

export const scatterRadius = 0.5;
