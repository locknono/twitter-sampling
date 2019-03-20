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

    const svgWidth = parseFloat(d3.select("#barchart-svg").style("width"));
    const svgHeight = parseFloat(d3.select("#barchart-svg").style("height"));

    this.setState({ svgWidth, svgHeight });
  }

  render() {
    const { svgHeight, svgWidth } = this.state;
    const { original, sampling, curTopic } = this.props;

    let originalBars = null,
      samplingBars = null;

    if (svgWidth && svgHeight) {
      const xStart = svgWidth * padding.barChartPadding;
      const xEnd = svgWidth * (1 - padding.barChartPadding);
      const y1Start = (svgHeight * padding.barChartPadding) / 2;
      const y1End = svgHeight * (0.5 - padding.barChartPadding / 2);
      const y2Start = svgHeight * (0.5 + padding.barChartPadding / 2);
      const y2End = svgHeight * (1 - padding.barChartPadding / 2);
      const xScale = d3
        .scaleBand()
        .domain(original.map((e, i) => i.toString()))
        .range([xStart, xEnd])
        .paddingInner(0.3);

      const yScale = d3
        .scaleLinear()
        .domain([0, Math.max(...original)])
        .range([y1End, y1Start]);

      const yScaleForSampling = d3
        .scaleLinear()
        .domain([0, Math.max(...sampling)])
        .range([y2End, y2Start]);
    }

    return (
      <svg id="matrix-svg">
        {originalBars}
        {samplingBars}
      </svg>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Matrix);
