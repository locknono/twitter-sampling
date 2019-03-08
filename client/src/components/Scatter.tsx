import * as React from "react";
import * as d3 from "d3";
import { setData, SCATTER_DATA } from "../actions/setDataAction";
import { color, padding, scatterRadius, topicNumber } from "../constants";
import { connect } from "react-redux";
import { useWidthAndHeight } from "src/hooks/layoutHooks";
interface Props {
  scatterData: ScatterData;
  docPrData: DocPrData;
  curTopic: CurTopic;
  setData: typeof setData;
}

const mapState = (state: any) => {
  const { scatterData, docPrData } = state.dataTree;
  const { curTopic } = state.uiState;
  return { scatterData, docPrData, curTopic };
};
const mapDispatch = {
  setData
};
function LdaScatterCanvasCanvas(props: Props) {
  const { setData, scatterData, docPrData, curTopic } = props;
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const [width, height] = useWidthAndHeight("scatter-canvas");

  const canvasRef = React.useRef(null);
  React.useLayoutEffect(() => {
    setCtx((canvasRef.current as any).getContext("2d"));
  }, []);

  React.useEffect(() => {
    fetchAndSetScatterData("./scatterData.json", setData);
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
    if (width && height && ctx && docPrData) {
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

      for (let id in scatterData) {
        const maxIndex = docPrData[id].indexOf(Math.max(...docPrData[id]));
        ctx.fillStyle = color.tenColors[maxIndex];
        ctx.beginPath();
        ctx.arc(
          xScale(scatterData[id][0]),
          yScale(scatterData[id][1]),
          scatterRadius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  });

  React.useEffect(() => {
    const points = [];
    if (curTopic === undefined || !ctx || !width || !height) return;
    for (let k in docPrData) {
      const maxIndex = docPrData[k].indexOf(Math.max(...docPrData[k]));
      if (maxIndex === curTopic) {
        points.push(scatterData[k]);
      }
    }
    const xScale = d3
      .scaleLinear()
      .domain([xMin, xMax])
      .range([
        width * padding.scatterPadding,
        width * (1 - padding.scatterPadding)
      ]);
    ctx.fillStyle = "black";
    const yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([
        height * padding.scatterPadding,
        height * (1 - padding.scatterPadding)
      ]);
    for (let i = 0; i < points.length; i++) {
      ctx.beginPath();
      ctx.arc(
        xScale(points[i][0]),
        yScale(points[i][1]),
        scatterRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }, [curTopic, ctx]);

  React.useEffect(() => {
    if (!ctx || !width || !height) return;

    const indices = [];
    for (let i = 0; i < topicNumber; i++) {
      indices.push(i.toString());
    }
    const xScale = d3
      .scaleBand()
      .domain(indices)
      .range([
        (width * padding.scatterPadding) / 3,
        (width * (1 - padding.scatterPadding)) / 2
      ])
      .paddingInner(0.2);

    indices.map((e, i) => {
      ctx.fillStyle = color.tenColors[i];
      ctx.fillRect(
        xScale(e) as number,
        height * (1 - padding.scatterPadding / 2),
        xScale.bandwidth(),
        xScale.bandwidth()
      );
    });

    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText(
      "10 topics",
      (xScale((topicNumber - 1).toString()) as number) + xScale.bandwidth() + 1,
      height * (1 - padding.scatterPadding / 2) + xScale.bandwidth() - 2.5
    );
  }, [ctx]);

  return (
    <canvas id="scatter-canvas" ref={canvasRef} width={width} height={height} />
  );
}

async function fetchAndSetScatterData(url: string, set: typeof setData) {
  const res = await fetch(url);
  const data = await res.json();
  set(SCATTER_DATA, data);
}

function getCoordByID(id: string) {}
export default connect(
  mapState,
  mapDispatch
)(LdaScatterCanvasCanvas);
