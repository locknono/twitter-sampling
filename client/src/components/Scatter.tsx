import * as React from "react";
import * as d3 from "d3";
import { useState, useEffect } from "react";
import { padding } from "../constants";
import { getMinMax, getSvgRenderWidthHeight } from "../shared";

interface Props {}

type ScatterData = [number, number][];
export default function Scatter(props: Props) {
  const [data, setData] = useState<ScatterData>([]);
  useEffect(() => {
    fetch("./scatterData.json")
      .then(res => res.json())
      .then((data: ScatterData) => {
        setData(data);
      });
  }, []);

  const xMin = d3.min(data, d => d[0]) as number;
  const xMax = d3.max(data, d => d[0]) as number;
  const yMin = d3.min(data, d => d[1]) as number;
  const yMax = d3.max(data, d => d[1]) as number;

  const xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([0, 380]);
  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([0, 380]);

  const points = data.map(e => {
    return (
      <circle
        key={`${xScale(e[0])}-${yScale(e[1])}`}
        cx={xScale(e[0])}
        cy={yScale(e[1])}
        r={3}
      />
    );
  });

  return <svg style={{ width: "100%", height: "100%" }}>{points}</svg>;
}
