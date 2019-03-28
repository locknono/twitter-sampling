import * as React from "react";
import * as d3 from "d3";
import { padding, color, url } from "../constants/constants";
import { setData } from "../actions/setDataAction";
import { setCurTopic, SAMPLING_CONDITION } from "../actions/setUIState";
import { connect } from "react-redux";
import { fetchJsonData } from "../shared";
import { updateQueue } from "src/fiber/updateQueue";
import Heading from "../components/Heading";
import { getURLBySamplingCondition } from "../shared/fetch";
interface Props {}

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
  samplingCondition: SAMPLING_CONDITION;
}

interface fetchedBarData {
  original: number[];
  sampling: number[];
  iter?: number[];
}

const mapStateToProps = (state: any, ownProps: any) => {
  const { originalBarData, samplingBarData } = state.dataTree;
  const { curTopic, samplingCondition } = state.uiState;
  return {
    original: originalBarData,
    sampling: samplingBarData,
    curTopic,
    samplingCondition
  };
};

const mapDispatchToProps = {
  setData,
  setCurTopic
};

let initialScale: any;
class Matrix extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      svgWidth: null,
      svgHeight: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(barIndex: CurTopic) {
    const { setCurTopic } = this.props;
    setCurTopic(barIndex);
  }

  componentDidMount() {
    const { setData } = this.props;
    fetchJsonData(url.barDataURL).then((data: fetchedBarData) => {
      setData("ORIGINAL_BARDATA", data.original);
      setData("SAMPLING_BARDATA", data.sampling);
    });
    const svgWidth = parseFloat(d3.select("#matrix-svg").style("width"));
    const svgHeight = parseFloat(d3.select("#matrix-svg").style("height"));
    this.setState({ svgWidth, svgHeight });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.samplingCondition !== this.props.samplingCondition) {
      const samplingURL = getURLBySamplingCondition(
        url.barDataURL,
        this.props.samplingCondition
      );
      fetchJsonData(samplingURL).then((data: fetchedBarData) => {
        setData("ORIGINAL_BARDATA", data.original);
        setData("SAMPLING_BARDATA", data.sampling);
      });
    }
  }

  render() {
    const { svgHeight, svgWidth } = this.state;
    const { original, sampling, curTopic } = this.props;

    let matrixRects = [];
    let color1;
    let color2;

    if (svgWidth && svgHeight && sampling.length > 0 && original.length > 0) {
      const matriXStart = (svgWidth * 0.1) / 2;
      const matrixYStart = svgHeight * 0.1;
      const matriXEnd = svgWidth * (1 - padding.barChartPadding / 2);
      const matrixYEnd = svgHeight * (1 - padding.barChartPadding / 2);
      const y2Start = svgHeight * (0.5 + padding.barChartPadding / 2);
      const y2End = svgHeight * (1 - padding.barChartPadding / 4);
      const xScale = d3
        .scaleBand()
        .domain(original.map((e, i) => i.toString()))
        .range([matriXStart, matriXEnd])
        .paddingInner(0.1);

      const yScale = d3
        .scaleBand()
        .domain(original.map((e, i) => i.toString()))
        .range([matrixYStart, matrixYEnd])
        .paddingInner(0.1);

      const r1 = getRelationList(original);

      const r2 = getRelationList(sampling);

      const d1 = getDiffList(original);
      const d2 = getDiffList(sampling);
      const allDiffs = [];

      for (let i = 0; i < d1.length; i++) {
        for (let j = 0; j < d1[i].length; j++) {
          const diff = Math.abs(d1[i][j] - d2[i][j]);
          allDiffs.push(diff);
        }
      }
      const minDiff = Math.min(...allDiffs);
      const maxDiff = Math.max(...allDiffs);

      let scale;
      if (!initialScale) {
        initialScale = d3
          .scaleLinear()
          .domain([minDiff, maxDiff])
          .range([0, 0.7]);
        scale = initialScale;
      } else {
        scale = initialScale;
      }

      color1 = d3.interpolateBlues(0.0);
      color2 = d3.interpolateBlues(0.7);
      for (let i = 0; i < d1.length; i++) {
        for (let j = 0; j < d1[i].length; j++) {
          let fillColor;
          if (r1[i][j] !== r2[i][j]) {
            fillColor = color.samplingColor;
          } else {
            const diff = Math.abs(d1[i][j] - d2[i][j]);
            fillColor = d3.interpolateBlues(scale(diff));
          }
          const x = xScale(i.toString());
          const y = yScale(j.toString());
          const width = xScale.bandwidth();
          const height = yScale.bandwidth();
          matrixRects.push(
            <rect
              className="matrix-rects"
              key={`${x}-${y}-${fillColor}`}
              width={width}
              height={height}
              x={x}
              y={y}
              fill={fillColor}
              stroke={color.matrixBorderColor}
              strokeWidth={1}
              rx={3}
              ry={3}
            />
          );
        }
      }
      const yScaleForSampling = d3
        .scaleLinear()
        .domain([0, Math.max(...sampling)])
        .range([y2End, y2Start]);
    }

    let colorBars;
    if (svgWidth && svgHeight) {
      const matriXStart = (svgWidth * 0.1) / 2 + 112;
      const matrixYStart = svgHeight * 0.1;
      const matriXEnd = svgWidth * (1 - padding.barChartPadding / 2);
      const matrixYEnd = svgHeight * (1 - padding.barChartPadding / 2);
      const width = svgHeight * 0.05;
      const textY = svgHeight * 0.06 + 3;
      colorBars = (
        <>
          <rect
            className="color-bar-rect"
            width={width}
            height={width}
            x={matriXStart}
            y={svgHeight * 0.03}
            fill={color.originalBarColor}
            stroke={color.originalBarColor}
            strokeWidth={1}
            rx={3}
            ry={3}
          />
          <text
            x={matriXStart + width + 2}
            y={textY}
            fontFamily="Verdana"
            fontSize="12"
          >
            uniform
          </text>
          <rect
            className="color-bar-rect"
            width={width}
            height={width}
            x={matriXStart + width + 50}
            y={svgHeight * 0.03}
            fill={color.samplingColor}
            stroke={color.samplingColor}
            strokeWidth={1}
            rx={3}
            ry={3}
          />
          <text
            x={matriXStart + width + 50 + width + 5}
            y={textY}
            fontFamily="Verdana"
            fontSize="12"
          >
            conflict
          </text>
        </>
      );
    }

    return (
      <div className="matrix-div view-div panel panel-default">
        <div className="panel-heading heading matrix-heading">
          Difference Matrix
          <div
            className="matrix-color-bar"
            style={{
              background: `linear-gradient(to right,
              ${color1},${color2})`
            }}
          />
          <div className="matrix-color-bar-text">difference:</div>
        </div>
        <svg id="matrix-svg">
          {matrixRects}
          {colorBars}
        </svg>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Matrix);

function getRelationList(list: number[]) {
  const ralationList: number[][] = [];
  for (let i = 0; i < list.length; i++) {
    ralationList.push([]);
    for (let j = 0; j < list.length; j++) {
      if (list[i] > list[j]) {
        ralationList[i][j] = 1;
      } else if (list[i] === list[j]) {
        ralationList[i][j] = 0;
      }
      if (list[i] < list[j]) {
        ralationList[i][j] = -1;
      }
    }
  }
  return ralationList;
}

function getDiffList(list: number[]) {
  const diffList: number[][] = [];
  for (let i = 0; i < list.length; i++) {
    diffList.push([]);
    for (let j = 0; j < list.length; j++) {
      diffList[i][j] = Math.abs(list[i] - list[j]);
    }
  }
  return diffList;
}
