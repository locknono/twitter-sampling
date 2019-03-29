import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";
import { connect } from "react-redux";
import { setData } from "src/actions/setDataAction";
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
import { url } from "src/constants/constants";
import Checkbox from "./Checkbox";
import SamplingButton from "./SamplingButton";
interface Props {
  setCurSystem: typeof setCurSystem;
  setSamplingFlag: typeof setSamplingFlag;
  setSamplingCondition: typeof setSamplingCondition;
  samplingCondition: boolean;
  setSelectedIDs: typeof setSelectedIDs;
  selectedIDs: string[];
  ifShowMapPoints: boolean;
  setIfShowMapPoints: typeof setIfShowMapPoints;
  ifShowHeatMap: boolean;
  setIfShowHeatMap: typeof setIfShowHeatMap;
  setWheelDay: typeof setWheelDay;
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
  setCurSystem,
  setSamplingFlag,
  setSamplingCondition,
  setSelectedIDs,
  setIfShowMapPoints,
  setIfShowHeatMap,
  setWheelDay
};

function MapControl(props: Props) {
  const {
    setCurSystem,
    setSamplingFlag,
    setSamplingCondition,
    samplingCondition,
    setSelectedIDs,
    selectedIDs,
    ifShowMapPoints,
    setIfShowMapPoints,
    ifShowHeatMap,
    setIfShowHeatMap,
    setWheelDay
  } = props;

  function handlePointsClick() {
    setIfShowMapPoints(!ifShowMapPoints);
  }

  function handleHeatMapClick() {
    setIfShowHeatMap(!ifShowHeatMap);
  }
  
  function slideToSetDay(day: number) {
    
  }

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
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(MapControl);
