import * as React from "react";
import * as d3 from "d3";
import { useState, useEffect } from "react";
import { padding } from "../constants";
import { getSvgRenderWidthHeight } from "../shared";

interface Props {
  width: number;
  height: number;
  values: number[];
}

interface BarData {
  original: number[];
  sampling: number[];
  iter: number[];
}

export default function BarChart(props: Props) {
  const { width, height } = props;
  const [barData, setBarData] = useState<BarData>({
    original: [],
    sampling: [],
    iter: []
  });
  const pad = padding.barChartPadding;
  const [renderWidth, renderHeight] = getSvgRenderWidthHeight(
    width,
    height,
    pad
  );

  useEffect(() => {
    fetch("./barData.json")
      .then(res => res.json())
      .then(data => {
        setBarData(data); //trigger re-render
      });
  }, []);

  let oriRects = null;
  let contrastRects = null;
  const [min, max] = getMinMax(barData);
  const barHeightScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([0, renderHeight]);

  const xScale1 = d3
    .scaleLinear()
    .domain([0, barData.original.length])
    .range([width * (pad / 2), renderWidth / 2]);

  const xScale2 = d3
    .scaleLinear()
    .domain([0, barData.original.length])
    .range([renderWidth / 2, width * (1 - pad / 2)]);

  oriRects = barData.original.map((e, i) => (
    <rect
      key={`${e}-${i}`}
      x={xScale1(i)}
      y={height - barHeightScale(e) - 5}
      width={width * (pad - 0.02)}
      height={barHeightScale(e)}
      style={{ fill: "steelblue" }}
    />
  ));

  contrastRects = barData.sampling.map((e, i) => (
    <rect
      key={`${e}-${i}`}
      x={xScale2(i)}
      y={height - barHeightScale(e) - 5}
      width={width * (pad - 0.02)}
      height={barHeightScale(e)}
      style={{ fill: "red" }}
    />
  ));

  return (
    <svg style={{ height: "100%", width: "100%" }}>
      {oriRects}
      {contrastRects}
    </svg>
  );
}

function getMinMax(barData: BarData) {
  const numbers = [...barData.original, ...barData.sampling, ...barData.iter];
  return [Math.min(...numbers), Math.max(...numbers)];
}
