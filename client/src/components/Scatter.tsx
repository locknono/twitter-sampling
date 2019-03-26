import * as React from "react";
import * as d3 from "d3";
import { setData, SCATTER_DATA, CLOUD_DATA } from "../actions/setDataAction";
import {
  setIfDrawCenters,
  setSelectedIDs,
  setCurTopic
} from "../actions/setUIState";
import {
  color,
  padding,
  scatterRadius,
  topicNumber,
  pythonServerURL,
  url
} from "../constants";
import { connect } from "react-redux";
import { useWidthAndHeight } from "src/hooks/layoutHooks";
import { useCtxWithRef } from "src/hooks/canvasHooks";
import { updateQueue } from "../fiber/updateQueue";
import createFiber from "../fiber/fiber";
import * as v4 from "uuid/v4";
import Heading from "../components/Heading";
interface Props {
  scatterData: ScatterPoint[];
  curTopic: CurTopic;
  setData: typeof setData;
  ifDrawScatterCenters: boolean;
  setIfDrawCenters: typeof setIfDrawCenters;
  setSelectedIDs: typeof setSelectedIDs;
  selectedIDs: string[];
  samplingFlag: boolean;
  setCurTopic: typeof setCurTopic;
}

const mapState = (state: any) => {
  const { scatterData } = state.dataTree;
  const {
    curTopic,
    ifDrawScatterCenters,
    selectedIDs,
    samplingFlag
  } = state.uiState;
  return {
    scatterData,
    curTopic,
    ifDrawScatterCenters,
    selectedIDs,
    samplingFlag
  };
};
const mapDispatch = {
  setData,
  setIfDrawCenters,
  setSelectedIDs,
  setCurTopic
};
function LdaScatterCanvasCanvas(props: Props) {
  const {
    setData,
    scatterData,
    curTopic,
    ifDrawScatterCenters,
    setSelectedIDs,
    selectedIDs,
    samplingFlag,
    setCurTopic
  } = props;
  const [o1, setO1] = React.useState<[number, number] | null>(null);
  const [o2, setO2] = React.useState<[number, number] | null>(null);
  const [selectFlag, setSelectFlag] = React.useState(false);
  const [scales, setScales] = React.useState<
    d3.ScaleLinear<number, number>[]
  >();

  const [reverseScales, setReverseScales] = React.useState<
    d3.ScaleLinear<number, number>[]
  >();
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
    if (samplingFlag === true) {
      fetchAndSetScatterData(url.samplingScatterPointsURL, setData);
    } else {
      fetchAndSetScatterData(url.scatterPointsURL, setData);
    }
  }, [samplingFlag]);

  React.useEffect(() => {
    if (!scatterData || !width || !height) return;
    const [xScale, yScale, reverseXScale, reverseYScale] = getScale(
      scatterData,
      width,
      height
    );
    setScales([xScale, yScale]);
    setReverseScales([reverseXScale, reverseYScale]);
  }, [width, height, scatterData]);

  //background
  React.useEffect(() => {
    if (!backgroudCtx || !scatterData || !scales || !width || !height) {
      return;
    }

    backgroudCtx.clearRect(0, 0, width, height);
    const [xScale, yScale] = scales;
    //todo:move slice function to shared.ts
    const sliceCount = 200;
    const slicePointsNumber = scatterData.length / sliceCount;
    const sliceIndices = [];
    for (let i = 0; i < sliceCount - 1; i++) {
      sliceIndices.push([
        Math.floor(i * slicePointsNumber),
        Math.floor((i + 1) * slicePointsNumber)
      ]);
    }
    sliceIndices.map(indices => {
      const fiber = createFiber(() => {
        for (let i = indices[0]; i < indices[1]; i++) {
          const e = scatterData[i];
          backgroudCtx.fillStyle = color.nineColors[e.topic];
          backgroudCtx.beginPath();
          backgroudCtx.arc(
            Math.floor(xScale(e.x)),
            Math.floor(yScale(e.y)),
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
  }, [scales]);

  //click function
  React.useEffect(() => {
    if (curTopic === undefined || !ctx || !width || !height || !scales) return;
    const [xScale, yScale] = scales;
    ctx.clearRect(0, 0, width, height);

    const curTopicPoints: ScatterPoint[] = [];
    scatterData.map(e => {
      if (e.topic === curTopic) curTopicPoints.push(e);
    });
    const fiber = createFiber(() => {
      ctx.fillStyle = "black";
      for (let i = 0; i < curTopicPoints.length; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.floor(xScale(curTopicPoints[i].x)),
          Math.floor(yScale(curTopicPoints[i].y)),
          scatterRadius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }, 1);
    updateQueue.push(fiber);
    updateQueue.flush();
  }, [curTopic, backgroudCtx, scales]);

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
  }, [backgroudCtx, scales]);

  //centers
  React.useEffect(() => {
    if (!ctx || !scatterData || ifDrawScatterCenters === false || !scales) {
      return;
    }
    if (width && height && ctx) {
      const [xScale, yScale] = scales;
      (async function drawCenters() {
        const res = await fetch(url.scatterCentersURL);
        const centers: [number, number][] = await res.json();
        centers.map((e, i) => {
          const fiber = createFiber(() => {
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(
              Math.floor(xScale(e[0])),
              Math.floor(yScale(e[1])),
              scatterRadius + 1,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }, 1);
          updateQueue.push(fiber);
        });
        updateQueue.flush();
      })();
    }
  }, [scatterData, ifDrawScatterCenters, scales]);

  //draw selected ids
  React.useEffect(() => {
    if (!ctx || !scatterData || !scales || selectedIDs.length === 0) {
      return;
    }
    if (!width || !height) return;
    const [xScale, yScale] = scales;
    const selectedPoints: ScatterPoint[] = [];
    selectedIDs.map(id => {
      for (let i = 0; i < scatterData.length; i++) {
        if (scatterData[i].id === id) {
          selectedPoints.push(scatterData[i]);
          break;
        }
      }
    });
    const fiber = createFiber(() => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "black";
      for (let i = 0; i < selectedPoints.length; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.floor(xScale(selectedPoints[i].x)),
          Math.floor(yScale(selectedPoints[i].y)),
          scatterRadius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }, 1);
    updateQueue.push(fiber);
    updateQueue.flush();
  }, [selectedIDs]);

  function handleClick(e: any) {
    if (e.ctrlKey !== true) return;

    if (!width || !height) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;

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
    if (
      y < height * (1 - padding.scatterPadding / 2) ||
      y > height * (1 - padding.scatterPadding / 2) + xScale.bandwidth()
    ) {
      return;
    }
    if (x > (xScale(topicNumber.toString()) as number)) return;
    for (let i = 0; i < topicNumber; i++) {
      const rectX = xScale(i.toString()) as number;
      if (x > rectX && x < rectX + xScale.bandwidth()) {
        setCurTopic(i);
        console.log("i: ", i);
        break;
      }
    }
  }
  function handleMouseDown(e: any) {
    const rect = e.target.getBoundingClientRect();
    const x1 = e.clientX - rect.x;
    const y1 = e.clientY - rect.y;
    setO1([x1, y1]);
    setO2(null);
    setSelectFlag(true);
  }
  function handleMouseMove(e: any) {
    const rect = e.target.getBoundingClientRect();
    const x2 = e.clientX - rect.x;
    const y2 = e.clientY - rect.y;
    setO2([x2, y2]);
  }
  function handleMouseUp(e: any) {
    if (!scales || !o1) return;
    const rect = e.target.getBoundingClientRect();
    const x2 = e.clientX - rect.x;
    const y2 = e.clientY - rect.y;
    const [x1, y1] = o1;
    setO2([x2, y2]);
    setSelectFlag(false);
    const [xScale, yScale] = scales;

    const ids = [];
    for (let i = 0; i < scatterData.length; i++) {
      const e = scatterData[i];
      const x = Math.floor(xScale(e.x));
      const y = Math.floor(yScale(e.y));
      if (x > x1 && x < x2 && y > y1 && y < y2) {
        ids.push(e.id);
      }
    }
    setSelectedIDs(ids);

    (async function setWordCloudDataWithSelectedIDs(ids: string[]) {
      if (ids.length === 0) return;
      const res = await fetch(pythonServerURL + "selectArea", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: JSON.stringify(ids)
      });
      const data = await res.json();
      setData(CLOUD_DATA, data);
    })(ids);
  }

  React.useEffect(() => {
    if (!ctx || !o1 || !o2 || !selectFlag || !width || !height) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color.selectAreaColoe;
    ctx.fillRect(o1[0], o1[1], o2[0] - o1[0], o2[1] - o1[1]);
  }, [o2]);
  return (
    <div className="scatter-div panel panel-default">
      <Heading title="Projection View" />
      <div className="scatter-canvas-div">
        <canvas
          id="scatter-canvas-background"
          ref={backgroundCanvasRef}
          width={width}
          height={height}
        />
        <canvas
          id="scatter-canvas"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          ref={canvasRef}
          width={width}
          height={height}
        />
      </div>
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

function getScale(scatterData: ScatterPoints, width: number, height: number) {
  const xMin = d3.min(scatterData, e => e.x) as number;
  const yMin = d3.min(scatterData, e => e.y) as number;
  const xMax = d3.max(scatterData, e => e.x) as number;
  const yMax = d3.max(scatterData, e => e.y) as number;
  const xDomian = [xMin, xMax];
  const xRange = [
    width * padding.scatterPadding,
    width * (1 - padding.scatterPadding)
  ];
  const yDomain = [yMin, yMax];
  const yRange = [
    height * padding.scatterPadding,
    height * (1 - padding.scatterPadding)
  ];
  const xScale = d3
    .scaleLinear()
    .domain(xDomian)
    .range(xRange);
  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range(yRange);

  const reverseXSacle = d3
    .scaleLinear()
    .domain(xRange)
    .range(xDomian);
  const reverseYSacle = d3
    .scaleLinear()
    .domain(yRange)
    .range(yDomain);

  return [xScale, yScale, reverseXSacle, reverseYSacle];
}
