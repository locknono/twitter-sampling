import * as React from "react";
import * as d3 from "d3";
import { padding, color, url } from "../constants";
import { setData } from "../actions/setDataAction";
import { setCurTopic } from "../actions/setUIState";
import { connect } from "react-redux";
import { fetchJsonData } from "../shared";
import { updateQueue } from "src/fiber/updateQueue";
import Heading from "../components/Heading";

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

  render() {
    const { svgHeight, svgWidth } = this.state;
    const { original, sampling, curTopic } = this.props;

    let matrixRects = [];
    let topBars;
    let leftBars;
    if (svgWidth && svgHeight && sampling.length > 0 && original.length > 0) {
      const matriXStart = (svgWidth * 0.1) / 2;
      const matrixYStart = (svgHeight * 0.1) / 2;
      const matriXEnd = svgWidth * (1 - padding.barChartPadding / 2);
      const matrixYEnd = svgHeight * (1 - padding.barChartPadding / 2);

      const topBarStart = svgHeight * 0.03;
      const leftBarStart = svgWidth * 0.03;

      const xStart = svgWidth * padding.barChartPadding;
      const xEnd = svgWidth * (1 - padding.barChartPadding);
      const y1Start = (svgHeight * padding.barChartPadding) / 2;
      const y1End = svgHeight * (0.5 - padding.barChartPadding / 2);
      const y2Start = svgHeight * (0.5 + padding.barChartPadding / 2);
      const y2End = svgHeight * (1 - padding.barChartPadding / 2);
      const xScale = d3
        .scaleBand()
        .domain(original.map((e, i) => i.toString()))
        .range([matriXStart, matriXEnd])
        .paddingInner(0.2);

      const yScale = d3
        .scaleBand()
        .domain(original.map((e, i) => i.toString()))
        .range([matrixYStart, matrixYEnd])
        .paddingInner(0.2);

      const topBarScale = d3
        .scaleLinear()
        .domain([0, Math.max(...original)])
        .range([matrixYStart - 5, topBarStart]);

      const leftBarScale = d3
        .scaleLinear()
        .domain([0, Math.max(...sampling)])
        .range([matriXStart - 5, leftBarStart]);

      topBars = getBars(
        original,
        xScale,
        topBarScale,
        curTopic,
        this.handleClick
      );

      leftBars = getLeftBars(
        sampling,
        leftBarScale,
        yScale,
        curTopic,
        this.handleClick
      );

      const r1 = getRelationList(original);
      const r2 = getRelationList(sampling);

      for (let i = 0; i < r1.length; i++) {
        for (let j = 0; j < r1[i].length; j++) {
          const equalFlag = r1[i][j] === r2[i][j] ? true : false;
          const fillColor =
            equalFlag === true ? color.matrixSameColor : color.matrixDiffColor;
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

    return (
      <div className="matrix-div panel panel-default">
        <Heading title="LDA Matrix" />
        <svg id="matrix-svg">{matrixRects}</svg>
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

function getBars(
  data: number[],
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>,
  curTopic: CurTopic,
  clickFunc: Function
) {
  const rects = data.map((e, i) => {
    const fillColor =
      curTopic === undefined || curTopic !== i
        ? color.originalBarColor
        : color.brighterBarColor;
    return (
      <rect
        key={e}
        x={xScale(i.toString())}
        y={yScale(e)}
        width={xScale.bandwidth()}
        height={yScale(0) - yScale(e)}
        fill={fillColor}
        onClick={() => clickFunc(i)}
        rx={3}
        ry={3}
      />
    );
  });
  return rects;
}

function getLeftBars(
  data: number[],
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleBand<string>,
  curTopic: CurTopic,
  clickFunc: Function
) {
  const rects = data.map((e, i) => {
    const fillColor =
      curTopic === undefined || curTopic !== i
        ? color.originalBarColor
        : color.brighterBarColor;
    return (
      <rect
        key={e}
        x={xScale(e)}
        y={yScale(i.toString())}
        width={xScale(0) - xScale(e)}
        height={yScale.bandwidth()}
        fill={fillColor}
        onClick={() => clickFunc(i)}
        rx={3}
        ry={3}
      />
    );
  });
  return rects;
}
