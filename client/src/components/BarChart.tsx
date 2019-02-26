import * as React from "react";
import * as d3 from "d3";
import { useState, useEffect } from "react";
import { padding } from "../constants";
import { getMinMax, getSvgRenderWidthHeight } from "../shared";
interface Props {
  width: number;
  height: number;
  values: number[];
}
export default function BarChart(props: Props) {
  const { width, height, values } = props;
  const pad = padding.barChartPadding;
  const [renderWidth, renderHeight] = getSvgRenderWidthHeight(
    width,
    height,
    pad
  );
  const [min, max] = getMinMax(values);

  const barHeightScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([0, renderHeight]);
  const xScale = d3
    .scaleLinear()
    .domain([0, values.length])
    .range([width * pad, renderWidth]);

  const rects = values.map((e, i) => (
    <rect
      key={`${e}-${i}`}
      x={xScale(i)}
      y={height - barHeightScale(e) - pad * height}
      width={width * (pad - 0.02)}
      height={barHeightScale(e)}
      style={{ fill: "steelblue" }}
    />
  ));
  return <svg style={{ height, width }}>{rects}</svg>;
}
