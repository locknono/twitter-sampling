import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";
import { connect, ReactReduxContext } from "react-redux";
import { setData, WHEEL_DATA } from "src/actions/setDataAction";
import {
  setIfDrawCenters,
  setSelectedIDs,
  setCurSystem,
  setSamplingFlag,
  setSamplingCondition,
  SAMPLING_CONDITION,
  setIfShowMapPoints,
  setIfShowHeatMap,
  setWheelDay
} from "../actions/setUIState";
import SliderWithLabel from "./SliderWithLabel";
import "../css/awesome-bootstrap-checkbox.css";
import {
  url,
  pythonServerURL,
  defaultMinWheelInter,
  defaultMinWheelValue
} from "src/constants/constants";
import Checkbox from "./Checkbox";
import SamplingButton from "./SamplingButton";
interface Props {
  samplingCondition: boolean;
  selectedIDs: string[];
  ifShowMapPoints: boolean;
  setIfShowMapPoints: typeof setIfShowMapPoints;
  ifShowHeatMap: boolean;
  setIfShowHeatMap: typeof setIfShowHeatMap;
  setWheelDay: typeof setWheelDay;
  setData: typeof setData;
}
const mapState = (state: any) => {
  const {
    samplingCondition,
    selectedIDs,
    ifShowMapPoints,
    ifShowHeatMap
  } = state.uiState;

  /* const { scatterData } = state.dataTree;
  const { curTopic, ifDrawScatterCenters, selectedIDs } = state.uiState;
  return { scatterData, curTopic, ifDrawScatterCenters, selectedIDs }; */
  return { samplingCondition, selectedIDs, ifShowMapPoints, ifShowHeatMap };
};
const mapDispatch = {
  setIfShowMapPoints,
  setIfShowHeatMap,
  setWheelDay,
  setData
};

function MapControl(props: Props) {
  const {
    selectedIDs,
    ifShowMapPoints,
    setIfShowMapPoints,
    ifShowHeatMap,
    setIfShowHeatMap,
    setWheelDay,
    setData
  } = props;

  const [minValue, setMinValue] = React.useState(defaultMinWheelValue);
  const [minInter, setMinInter] = React.useState(defaultMinWheelInter);

  function handlePointsClick() {
    setIfShowMapPoints(!ifShowMapPoints);
  }

  function handleHeatMapClick() {
    setIfShowHeatMap(!ifShowHeatMap);
  }

  function slideToSetDay(day: number) {
    setWheelDay(day);
  }

  function slideToSetMinValue(value: number) {
    setMinValue(value);
  }

  function sliderToSetMinInter(value: number) {
    setMinInter(value);
  }

  React.useEffect(() => {
    const postData = {
      selectedIDs,
      minValue,
      minInter
    };
    (async () => {
      const res = await fetch(pythonServerURL + "getWheelDataByIDs", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: JSON.stringify(postData)
      });
      const wheelData = await res.json();
      setData(WHEEL_DATA, wheelData);
    })();
  }, [minValue, minInter]);

  const pointsText = ifShowMapPoints ? "Hide Points" : "Show Points";
  const heatText = ifShowHeatMap ? "Hide Heatmap" : "Show Heatmap";
  return (
    <div className="panel panel-default map-control">
      <button
        className="btn btn-default btn-sm white-button"
        onClick={handlePointsClick}
      >
        {pointsText}
      </button>
      <button
        className="btn btn-default btn-sm white-button"
        onClick={handleHeatMapClick}
      >
        {heatText}
      </button>
      <SliderWithLabel
        name="select date"
        min={11}
        max={17}
        defaultValue={12}
        color="blue"
        step={1}
        sliderMethod={slideToSetDay}
      />

      <SliderWithLabel
        name="min frequency"
        min={0}
        max={100}
        defaultValue={defaultMinWheelValue}
        color="blue"
        step={1}
        sliderMethod={slideToSetMinValue}
      />

      <SliderWithLabel
        name="min interval"
        min={1}
        max={120}
        defaultValue={defaultMinWheelInter}
        color="blue"
        step={1}
        sliderMethod={sliderToSetMinInter}
      />
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(MapControl);
