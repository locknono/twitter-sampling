import * as React from "react";
import * as d3 from "d3";
import { setData, SCATTER_DATA } from "../actions/setDataAction";
import { color } from "../constants";
import { connect } from "react-redux";
interface Props {
  setData: typeof setData;
  scatterData: ScatterData;
}

const mapState = (state: any) => {
  const { scatterData } = state.dataTree;
  return { scatterData };
};
const mapDispatch = {
  setData
};
function LdaScatter(props: Props) {
  const { setData, scatterData } = props;
  const [width, setWidth] = React.useState<number | null>(null);
  const [height, setHeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    fetchAndSetScatterData("./scatterData.json", setData);
  }, []);

  React.useLayoutEffect(() => {
    const w = parseFloat(d3.select("#scatter").style("width"));
    const h = parseFloat(d3.select("#scatter").style("height"));
    setWidth(w);
    setHeight(h);
  }, []);

  const points = [];
  for (let k in scatterData) {
    const p = scatterData[k];
    points.push(p);
  }

  const xMin = d3.min(points, d => d[0]) as number;
  const xMax = d3.max(points, d => d[0]) as number;
  const yMin = d3.min(points, d => d[1]) as number;
  const yMax = d3.max(points, d => d[1]) as number;
  let circles = null;
  if (width && height) {
    const xScale = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([0, height]);

    circles = points.map(e => {
      return (
        <circle
          key={`${e[0]}-${e[1]}`}
          cx={xScale(e[0])}
          cy={yScale(e[1])}
          r={1}
          fill={color.scatterColor}
        />
      );
    });
  }

  return <svg id="scatter">{circles}</svg>;
}

async function fetchAndSetScatterData(url: string, set: typeof setData) {
  const res = await fetch(url);
  const data = await res.json();
  set(SCATTER_DATA, data);
}

export default connect(
  mapState,
  mapDispatch
)(LdaScatter);
