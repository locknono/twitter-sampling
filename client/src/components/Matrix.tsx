import * as React from "react";
import * as d3 from "d3";
import { padding, color, url } from "../constants";
import { setData } from "../actions/setDataAction";
import { setCurTopic } from "../actions/setUIState";
import { connect } from "react-redux";
import { fetchJsonData } from "../shared";
import { updateQueue } from "src/fiber/updateQueue";
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
    console.log("sampling: ", sampling);
    console.log("original: ", original);

    let matrixRects = [];
    if (svgWidth && svgHeight && sampling.length > 0 && original.length > 0) {
      const matriXStart = svgWidth * 0.3;
      const matrixYStart = svgHeight * 0.3;
      const matriXEnd = svgWidth * (1 - padding.barChartPadding / 0.2);
      const matrixYEnd = svgHeight * (1 - padding.barChartPadding / 0.2);
      const xStart = svgWidth * padding.barChartPadding;
      const xEnd = svgWidth * (1 - padding.barChartPadding);
      const y1Start = (svgHeight * padding.barChartPadding) / 2;
      const y1End = svgHeight * (0.5 - padding.barChartPadding / 2);
      const y2Start = svgHeight * (0.5 + padding.barChartPadding / 2);
      const y2End = svgHeight * (1 - padding.barChartPadding / 2);
      const xScale = d3
        .scaleBand()
        .domain(original.map((e, i) => i.toString()))
        .range([matriXStart, matriXEnd]);

      const yScale = d3
        .scaleBand()
        .domain(original.map((e, i) => i.toString()))
        .range([matrixYStart, matrixYEnd]);

      const r1 = getRelationList(original);
      const r2 = getRelationList(sampling);

      for (let i = 0; i < r1.length; i++) {
        for (let j = 0; j < r1[i].length; j++) {
          const equalFlag = r1[i][j] === r2[i][j] ? true : false;
          const fillColor = equalFlag === true ? "blue" : "red";
          const x = xScale(i.toString());
          const y = yScale(j.toString());
          matrixRects.push(
            <rect
              key={`${x}-${y}-${fillColor}`}
              width={xScale.bandwidth()}
              height={yScale.bandwidth()}
              x={x}
              y={y}
              fill={fillColor}
              stroke={color.matrixBorderColor}
              strokeWidth={1}
            />
          );
        }
      }
      const yScaleForSampling = d3
        .scaleLinear()
        .domain([0, Math.max(...sampling)])
        .range([y2End, y2Start]);
    }

    return <svg id="matrix-svg">{matrixRects}</svg>;
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
  console.log("ralationList: ", ralationList);
  return ralationList;
}
