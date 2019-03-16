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
    fetchAndSetScatterData("./scatterPoints.json", setData);
  }, []);

  //background
  React.useEffect(() => {
    if (!backgroudCtx || !docPrData || !scatterData) {
      return;
    }
    if (width && height && backgroudCtx && docPrData) {
      const [xScale, yScale] = getScale(scatterData, width, height);

      scatterData.map((e, i) => {
        const fiber = createFiber(() => {
          backgroudCtx.fillStyle = color.nineColors[i];
          for (let i = 0; i < e.length; i++) {
            backgroudCtx.beginPath();
            backgroudCtx.arc(
              Math.floor(xScale(e[i][0])),
              Math.floor(yScale(e[i][1])),
              scatterRadius,
              0,
              Math.PI * 2
            );
            backgroudCtx.fill();
          }
        }, 1);
        updateQueue.push(fiber);
      });
      updateQueue.flush();
    }
  }, [scatterData, docPrData]);

  //click function
  React.useEffect(() => {
    if (curTopic === undefined || !ctx || !width || !height) return;

    const [xScale, yScale] = getScale(scatterData, width, height);

    ctx.clearRect(0, 0, width, height);

    const fiber = createFiber(() => {
      ctx.fillStyle = "black";
      console.log("curTopic: ", curTopic);
      for (let i = 0; i < scatterData[curTopic].length; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.floor(xScale(scatterData[curTopic][i][0])),
          Math.floor(yScale(scatterData[curTopic][i][1])),
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
      backgroudCtx.fillStyle = color.nineColors[i];
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
      `${topicNumber} topics`,
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
  const scatterData = await res.json();
  set(SCATTER_DATA, scatterData);
}

function getCoordByID(id: string) {}
export default connect(
  mapState,
  mapDispatch
)(LdaScatterCanvasCanvas);

function getScale(scatterData: ScatterData, width: number, height: number) {
  const xMin = d3.min(scatterData, e => {
    return d3.min(e, d => d[0]);
  }) as number;
  const yMin = d3.min(scatterData, e => {
    return d3.min(e, d => d[1]);
  }) as number;
  const xMax = d3.max(scatterData, e => {
    return d3.max(e, d => d[0]);
  }) as number;
  const yMax = d3.max(scatterData, e => {
    return d3.max(e, d => d[1]);
  }) as number;
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
  return [xScale, yScale];
}
