import * as React from "react";
import * as d3 from "d3";
import { padding, color } from "../constants";
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

class BarChart extends React.Component<Props, State> {
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
    fetchJsonData("./barData.json").then((data: fetchedBarData) => {
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

      const x1g = d3
        .select("#x1-axis-g")
        .attr(
          "transform",
          `translate(${0},${svgHeight * (1 - padding.barChartPadding / 2)})`
        )
        .call(
          d3
            .axisBottom(xScale)
            .tickSizeOuter(0)
            .tickSize(3)
        );
      const y1g = d3
        .select("#y1-axis-g")
        .attr("transform", `translate(${xStart},0)`)
        .call(
          d3
            .axisLeft(yScale)
            .tickSizeOuter(0)
            .tickSize(3)
        )
        .call(y1g => {
          y1g.select(".domain").remove();
        });

      const x2g = d3
        .select("#x2-axis-g")
        .attr("transform", `translate(${0},${y1End})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickSizeOuter(0)
            .tickSize(3)
        );

      const y2g = d3
        .select("#y2-axis-g")
        .attr("transform", `translate(${xStart},0)`)
        .call(
          d3
            .axisLeft(yScaleForSampling)
            .tickSizeOuter(0)
            .tickSize(3)
        )
        .call(y2g => {
          y2g.select(".domain").remove();
        });

      originalBars = getBars(
        original,
        xScale,
        yScale,
        curTopic,
        this.handleClick
      );

      samplingBars = getBars(
        sampling,
        xScale,
        yScaleForSampling,
        curTopic,
        this.handleClick
      );
    }

    return (
      <svg id="barchart-svg">
        {originalBars}
        {samplingBars}
        <g id="x1-axis-g" />
        <g id="y1-axis-g">
          <text
            transform={`translate(3,10)`}
            style={{ stroke: "black", strokeWidth: 1 }}
          >
            original
          </text>
        </g>
        <g id="x2-axis-g" />
        <g id="y2-axis-g">
          <text
            transform={`translate(10,160)`}
            style={{ stroke: "black", strokeWidth: 1 }}
          >
            sampling
          </text>
        </g>
      </svg>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BarChart);

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
      />
    );
  });
  return rects;
}
