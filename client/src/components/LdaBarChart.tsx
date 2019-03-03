import * as React from "react";
import * as d3 from "d3";
import { padding, color } from "../constants";
import { setData } from "../actions/setDataAction";
import { setCurTopic } from "../actions/setUIState";
import { connect } from "react-redux";
import dataTree from "../reducers/dataTree";
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

class LdaBarChart extends React.Component<Props, State> {
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
    fetch("./barData.json")
      .then(res => res.json())
      .then((data: fetchedBarData) => {
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
      const xScale = d3
        .scaleBand()
        .domain(original.map((e, i) => i.toString()))
        .range([
          svgWidth * padding.barChartPadding,
          svgWidth * (1 - padding.barChartPadding)
        ])
        .paddingInner(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, Math.max(...original)])
        .range([
          svgHeight * (0.5 - padding.barChartPadding / 2),
          (svgHeight * padding.barChartPadding) / 2
        ]);

      const yScaleForSampling = d3
        .scaleLinear()
        .domain([0, Math.max(...sampling)])
        .range([
          svgHeight * (1 - padding.barChartPadding / 2),
          svgHeight * (0.5 + padding.barChartPadding / 2)
        ]);

      originalBars = original.map((e, i) => {
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
            onClick={() => this.handleClick(i)}
          />
        );
      });

      samplingBars = sampling.map((e, i) => {
        const fillColor =
          curTopic === undefined || curTopic !== i
            ? color.originalBarColor
            : color.brighterBarColor;
        return (
          <rect
            key={e}
            x={xScale(i.toString())}
            y={yScaleForSampling(e)}
            width={xScale.bandwidth()}
            height={yScaleForSampling(0) - yScaleForSampling(e)}
            fill={fillColor}
            onClick={() => this.handleClick(i)}
          />
        );
      });
    }

    return (
      <svg className="view-svg" id="barchart-svg">
        {originalBars}
        {samplingBars}
      </svg>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LdaBarChart);
