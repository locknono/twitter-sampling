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
    const xStart = width * 0.05;
    const xEnd = width * (1 - 0.05);
    const yStart = height * 0.05;
    const yEnd = height * (1 - 0.05);

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
      .domain([minValue, maxValue])
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
        />
      );
      bars.push(
        <rect
          key={v4()}
          x={(xScale(i.toString()) as number) + xScale.bandwidth() / 2}
          y={yScale(original[i])}
          width={xScale.bandwidth() / 2}
          height={yScale(0) - yScale(original[i])}
          fill={color.samplingColor}
          rx={2}
          ry={2}
        />
      );
    }
  }

  return (
    <div className="groupbar-div panel panel-default">
      <Heading title="LDA Bar Chart" />
      <svg id="groupbar-svg">{bars}</svg>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupBar);
