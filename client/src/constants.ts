import * as d3 from "d3";
import { namespace } from "d3";

/**nine categorical colors */
export const colorScale = d3.scaleOrdinal(d3.schemeSet1);

export namespace padding {
  export const barChartPadding = 0.1;
  export const scatterPadding = 0.1;
}
