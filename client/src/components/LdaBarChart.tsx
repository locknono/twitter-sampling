import * as React from "react";
import * as d3 from "d3";
import { padding, color } from "../constants";
interface Props {}

interface State {
  original: number[];
  sampling: number[];
  iter?: number[];
  svgWidth: number | null;
  svgHeight: number | null;
}

interface fetchedBarData {
  original: number[];
  sampling: number[];
  iter?: number[];
}
class LdaBarChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      original: [],
      sampling: [],
      svgWidth: null,
      svgHeight: null
    };
  }

  componentDidMount() {
    fetch("./barData.json")
      .then(res => res.json())
      .then((data: fetchedBarData) => {
        this.setState(data);
      });

    const svgWidth = parseFloat(d3.select("#barchart-svg").style("width"));
    const svgHeight = parseFloat(d3.select("#barchart-svg").style("height"));

    this.setState({ svgWidth, svgHeight });
  }

  render() {
    const { original, sampling, svgHeight, svgWidth } = this.state;

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
        return (
          <rect
            key={e}
            x={xScale(i.toString())}
            y={yScale(e)}
            width={xScale.bandwidth()}
            height={yScale(0) - yScale(e)}
            fill={color.originalBarColor}
          />
        );
      });

      samplingBars = sampling.map((e, i) => {
        return (
          <rect
            key={e}
            x={xScale(i.toString())}
            y={yScaleForSampling(e)}
            width={xScale.bandwidth()}
            height={yScaleForSampling(0) - yScaleForSampling(e)}
            fill={color.originalBarColor}
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

export default LdaBarChart;
