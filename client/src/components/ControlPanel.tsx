import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";
import { connect } from "react-redux";
import { setData } from "src/actions/setDataAction";
import {
  setIfDrawCenters,
  setSelectedIDs,
  setCurSystem,
  setSamplingFlag
} from "../actions/setUIState";
import SliderWithLabel from "./SliderWithLabel";

interface Props {
  setCurSystem: typeof setCurSystem;
  setSamplingFlag: typeof setSamplingFlag;
}
const mapState = (state: any) => {
  /* const { scatterData } = state.dataTree;
  const { curTopic, ifDrawScatterCenters, selectedIDs } = state.uiState;
  return { scatterData, curTopic, ifDrawScatterCenters, selectedIDs }; */
  return {};
};
const mapDispatch = {
  setCurSystem,
  setSamplingFlag
};

function ControlPanel(props: Props) {
  const { setCurSystem, setSamplingFlag } = props;

  function handleSystemNameClick(name: "twitter" | "yelp") {
    setCurSystem(name);
  }

  function handleSamplingClick(flag: boolean) {
    setSamplingFlag(flag);
  }
  return (
    <div className="panel panel-default control-panel-div">
      <Heading title="Control Panel" />
      <div className="control-panel-content-div">
        <div className="buttons-div " id="buttons-div1">
          <span>select data:</span>
          <button
            id="twitter"
            className="btn btn-default btn-sm"
            onClick={handleSystemNameClick.bind(null, "twitter")}
          >
            twitter
          </button>
          <button
            id="yelp"
            onClick={handleSystemNameClick.bind(null, "yelp")}
            className="btn btn-default btn-sm"
          >
            yelp
          </button>
        </div>
        <div className="buttons-div " id="buttons-div2">
          <span>select status:</span>
          <button
            id="original"
            onClick={handleSamplingClick.bind(null, false)}
            className="btn btn-default btn-sm"
          >
            original
          </button>
          <button
            id="sampling"
            onClick={handleSamplingClick.bind(null, true)}
            className="btn btn-default btn-sm"
          >
            sampling
          </button>
        </div>
        <SliderWithLabel
          name="LDA topic number"
          min={1}
          max={20}
          color="red"
          step={1}
        />

        <SliderWithLabel
          name="disk radius"
          min={0}
          max={1}
          color="blue"
          step={0.1}
        />
      </div>
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(ControlPanel);
