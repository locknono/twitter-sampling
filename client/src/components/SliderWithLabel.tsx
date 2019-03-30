import Slider from "rc-slider";
import * as React from "react";
import "rc-slider/assets/index.css";

interface Props {
  name: string;
  color: string;
  min: number;
  max: number;
  step: number;
  defaultValue?: number;
  changeOneWeight?: any;
  index?: number;
  sliderMethod?: any;
  endMethod?: any;
}
interface State {
  value: number;
}
class SliderWithLabel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    /**Initializing state with props is not recommended and sometimes dangerous
     * but i'm sure defaultValue's never gonna change here */
    this.state = {
      value: this.props.defaultValue ? this.props.defaultValue : 0.2
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
  }

  handleChange(e: number) {
    const { sliderMethod } = this.props;
    if (sliderMethod) {
      sliderMethod(e);
    }
    this.setState({ value: e });
  }

  handleEnd(e: number) {
    const { endMethod } = this.props;
    if (endMethod) {
      endMethod(e);
    }
    this.setState({ value: e });
  }
  render() {
    const { name, color, min, max, step, defaultValue } = this.props;
    const { value } = this.state;

    let nameTag;
    if (name === "Searching Region") {
      nameTag = (
        <React.Fragment>
          <span className="slider-text" style={{ marginLeft: 0 }}>
            Searching
          </span>
          <br />
          <span className="slider-text">Region</span>
        </React.Fragment>
      );
    } else {
      nameTag = name;
    }
    let nameStyle;
    if (name === "Threshold") {
      nameStyle = { fontSize: `13px` };
    }
    let valueStr;
    if (value < 1) valueStr = value.toFixed(2).toString();
    else if (value >= 1 && value < 10) {
      valueStr = `${value}  `;
    } else {
      valueStr = value.toString();
    }
    return (
      <div className="slider-with-label">
        <span className="slider-text" style={nameStyle}>
          {nameTag}
        </span>
        <div className="slider-div">
          <Slider
            min={min}
            max={max}
            step={step}
            defaultValue={defaultValue}
            value={value}
            onChange={this.handleChange}
            onAfterChange={this.handleEnd}
            trackStyle={{ backgroundColor: color }}
            handleStyle={{ borderColor: color, borderRadius: `25%` }}
          />
        </div>
        <span className="slider-value-text">{valueStr}</span>
      </div>
    );
  }
}

export default SliderWithLabel;
