import * as React from "react";
import * as d3 from "d3";
import { padding, color, url } from "../constants";
import { setData } from "../actions/setDataAction";
import { setCurTopic } from "../actions/setUIState";
import { connect } from "react-redux";
import { fetchJsonData } from "../shared";
import { updateQueue } from "src/fiber/updateQueue";
import Heading from "../components/Heading";
import { useWidthAndHeight } from "../hooks/layoutHooks";
import * as v4 from "uuid/v4";
interface State {
  iter?: number[];
  svgWidth: number | null;
  svgHeight: number | null;
}

interface Props {
  setData: typeof setData;
  setCurTopic: typeof setCurTopic;
  original: number[];
  sampling: number[];
  curTopic: CurTopic;
}

interface fetchedBarData {
  original: number[];
  sampling: number[];
  iter?: number[];
}

const mapStateToProps = (state: any, ownProps: any) => {
  const { originalBarData, samplingBarData } = state.dataTree;
  const { curTopic } = state.uiState;
  return { original: originalBarData, sampling: samplingBarData, curTopic };
};

const mapDispatchToProps = {
  setData,
  setCurTopic
};

function GroupBar(props: Props) {
  const { setData, setCurTopic, original, sampling, curTopic } = props;

  const [width, height] = useWidthAndHeight("groupbar-svg");

  let bars: JSX.Element[] = [];

  React.useLayoutEffect(() => {
    fetchJsonData(url.barDataURL).then((data: fetchedBarData) => {
      setData("ORIGINAL_BARDATA", data.original);
      setData("SAMPLING_BARDATA", data.sampling);
    });
  }, []);

  if (width && height && sampling.length !== 0 && original.length !== 0) {
    const pad = 0.1;
    const xStart = width * pad;
    const xEnd = width * (1 - pad / 2);
    const yStart = height * pad;
    const yEnd = height * (1 - pad);

    let minValue = Number.MAX_SAFE_INTEGER;
    let maxValue = 0;
    original.map(e => {
      if (e > maxValue) maxValue = e;
      if (e < minValue) minValue = e;
    });

    sampling.map(e => {
      if (e > maxValue) maxValue = e;
      if (e < minValue) minValue = e;
    });

    const xScale = d3
      .scaleBand()
      .domain(original.map((e, i) => i.toString()))
      .range([xStart, xEnd])
      .paddingInner(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([yEnd, yStart]);

    for (let i = 0; i < original.length; i++) {
      bars.push(
        <rect
          key={v4()}
          x={xScale(i.toString())}
          y={yScale(original[i])}
          width={xScale.bandwidth() / 2}
          height={yScale(0) - yScale(original[i])}
          fill={color.originalBarColor}
          rx={2}
          ry={2}
          onClick={() => {
            setCurTopic(i);
          }}
        />
      );
      bars.push(
        <rect
          key={v4()}
          x={(xScale(i.toString()) as number) + xScale.bandwidth() / 2}
          y={yScale(sampling[i])}
          width={xScale.bandwidth() / 2}
          height={yScale(0) - yScale(sampling[i])}
          fill={color.samplingColor}
          rx={2}
          ry={2}
          onClick={() => {
            setCurTopic(i);
          }}
        />
      );
    }

    const x1g = d3
      .select("#x1-axis-g")
      .attr("transform", `translate(${0},${height * (1 - pad)})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSizeOuter(0)
          .tickSize(3)
      )
      .call(x1g => {
        x1g.selectAll("text").attr("dy", "0.51em");
      });
    const y1g = d3
      .select("#y1-axis-g")
      .attr("transform", `translate(${xStart},0)`)
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSizeOuter(0)
          .tickSize(3)
      )
      .call(y1g => {
        y1g.select(".domain").remove();
      });
  }

  let colorBars;
  if (width && height) {
    const pad = 0.1;
    const xStart = 127.5;
    const xEnd = width * (1 - pad);
    const yStart = 7;
    const yEnd = height * (1 - pad);
    const textY = height * 0.06 + 3 + 6.5;
    const barWidth = 11.7;
    colorBars = (
      <>
        <rect
          className="color-bar-rect"
          width={barWidth}
          height={barWidth}
          x={xStart}
          y={yStart}
          fill={color.originalBarColor}
          stroke={color.originalBarColor}
          strokeWidth={1}
          rx={3}
          ry={3}
        />
        <text
          x={xStart + barWidth + 4.5}
          y={textY}
          fontFamily="Verdana"
          fontSize="12"
        >
          original
        </text>
        <rect
          className="color-bar-rect"
          width={barWidth}
          height={barWidth}
          x={xStart + barWidth + 50}
          y={yStart}
          fill={color.samplingColor}
          stroke={color.samplingColor}
          strokeWidth={1}
          rx={3}
          ry={3}
        />
        <text
          x={xStart + barWidth + 50 + barWidth + 4.5}
          y={textY}
          fontFamily="Verdana"
          fontSize="12"
        >
          sampling
        </text>
      </>
    );
  }

  return (
    <div className="groupbar-div view-div panel panel-default">
      <Heading title="LDA Bar Chart" />
      <svg id="groupbar-svg">
        <g className="group-rects-g">
          {bars}
          {colorBars}
        </g>
        <g id="x1-axis-g" />
        <g id="y1-axis-g" />
      </svg>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupBar);
