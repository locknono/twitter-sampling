import * as React from "react";
import * as d3 from "d3";
import { setData, SCATTER_DATA } from "../actions/setDataAction";
import { color, padding } from "../constants";
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
function LdaScatterCanvasCanvas(props: Props) {
  const { setData, scatterData } = props;
  const [width, setWidth] = React.useState<number | undefined>(undefined);
  const [height, setHeight] = React.useState<number | undefined>(undefined);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);

  const canvasRef = React.useRef(null);
  React.useLayoutEffect(() => {
    setCtx((canvasRef.current as any).getContext("2d"));
  }, []);

  React.useEffect(() => {
    fetchAndSetScatterData("./scatterData.json", setData);
  }, []);

  React.useLayoutEffect(() => {
    const w = parseFloat(d3.select("#scatter-canvas").style("width"));
    const h = parseFloat(d3.select("#scatter-canvas").style("height"));
    setWidth(w);
    setHeight(h);
  }, []);

  const points: [number, number][] = [];
  for (let k in scatterData) {
    const p = scatterData[k];
    points.push(p);
  }

  const xMin = d3.min(points, d => d[0]) as number;
  const xMax = d3.max(points, d => d[0]) as number;
  const yMin = d3.min(points, d => d[1]) as number;
  const yMax = d3.max(points, d => d[1]) as number;

  React.useEffect(() => {
    if (width && height && ctx) {
      const xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([
          width * padding.scatterPadding,
          width * (1 - padding.scatterPadding)
        ]);
      const yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([
          height * padding.scatterPadding,
          height * (1 - padding.scatterPadding)
        ]);

      ctx.fillStyle = color.scatterColor;
      for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(
          xScale(points[i][0]),
          yScale(points[i][1]),
          0.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  });

  return (
    <canvas id="scatter-canvas" ref={canvasRef} width={width} height={height} />
  );
}

async function fetchAndSetScatterData(url: string, set: typeof setData) {
  const res = await fetch(url);
  const data = await res.json();
  set(SCATTER_DATA, data);
}

export default connect(
  mapState,
  mapDispatch
)(LdaScatterCanvasCanvas);
