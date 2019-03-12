import * as React from "react";
import * as d3 from "d3";
import { setData, SCATTER_DATA } from "../actions/setDataAction";
import { color, padding, scatterRadius, topicNumber } from "../constants";
import { connect } from "react-redux";
import { useWidthAndHeight } from "src/hooks/layoutHooks";
import { useCtxWithRef } from "src/hooks/canvasHooks";
import { updateQueue } from "../fiber/updateQueue";
import createFiber from "../fiber/fiber";
import * as v4 from "uuid/v4";

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

  const [width, height] = useWidthAndHeight("scatter-canvas");

  const [
    backgroudCtx,
    setBackgroundCtx
  ] = React.useState<CanvasRenderingContext2D | null>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const backgroundCanvasRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  React.useLayoutEffect(() => {
    setBackgroundCtx((backgroundCanvasRef.current as any).getContext("2d"));
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

  //background
  React.useEffect(() => {
    if (!backgroudCtx || !docPrData || !scatterData) {
      return;
    }
    if (width && height && backgroudCtx && docPrData) {
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
      const keys = Object.keys(scatterData);
      const sliceCount = 200;
      const pad = keys.length / sliceCount;
      const indexSlices = [];
      for (let i = 0; i < sliceCount; i++) {
        indexSlices.push([Math.floor(i * pad), Math.floor((i + 1) * pad)]);
      }

      const drawSlice = (startIndex: number, endIndex: number) => () => {
        for (let i = startIndex; i < endIndex; i++) {
          const id = keys[i];
          const maxIndex = docPrData[id].indexOf(Math.max(...docPrData[id]));
          backgroudCtx.fillStyle = color.tenColors[maxIndex];
          backgroudCtx.beginPath();
          backgroudCtx.arc(
            Math.floor(xScale(scatterData[id][0])),
            Math.floor(yScale(scatterData[id][1])),
            scatterRadius,
            0,
            Math.PI * 2
          );
          backgroudCtx.fill();
        }
      };
      for (let i = 0; i < indexSlices.length; i++) {
        const fiber = createFiber(
          drawSlice(indexSlices[i][0], indexSlices[i][1])
        );
        updateQueue.push(fiber);
      }
      updateQueue.flush();
    }
  }, [scatterData, docPrData]);

  //click function
  React.useEffect(() => {
    const points: [number, number][] = [];
    if (curTopic === undefined || !ctx || !width || !height) return;
    ctx.clearRect(0, 0, width, height);
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
    const fiber = createFiber(() => {
      for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.floor(xScale(points[i][0])),
          Math.floor(yScale(points[i][1])),
          scatterRadius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }, 1);
    updateQueue.push(fiber);
    updateQueue.flush();
  }, [curTopic, backgroudCtx]);

  //color bars
  React.useEffect(() => {
    if (!backgroudCtx || !width || !height) return;
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
      backgroudCtx.fillStyle = color.tenColors[i];
      backgroudCtx.fillRect(
        xScale(e) as number,
        height * (1 - padding.scatterPadding / 2),
        xScale.bandwidth(),
        xScale.bandwidth()
      );
    });

    backgroudCtx.fillStyle = "black";
    backgroudCtx.font = "12px Arial";
    backgroudCtx.fillText(
      "10 topics",
      (xScale((topicNumber - 1).toString()) as number) + xScale.bandwidth() + 1,
      height * (1 - padding.scatterPadding / 2) + xScale.bandwidth() - 2.5
    );
  }, [backgroudCtx]);

  return (
    <div className="scatter-canvas-div">
      <canvas
        id="scatter-canvas-background"
        ref={backgroundCanvasRef}
        width={width}
        height={height}
      />
      <canvas
        id="scatter-canvas"
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
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

function drawCurTopic() {}
