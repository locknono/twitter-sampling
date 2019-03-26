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
import "../css/awesome-bootstrap-checkbox.css";

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
          <button
            id="twitter"
            className="btn btn-default btn-sm white-button"
            onClick={handleSystemNameClick.bind(null, "twitter")}
          >
            dataset
          </button>
          <input type="text" style={{ height: 25 }} />
        </div>

        <div className="checkbox-div">
          <form role="form">
            <div className="checkbox">
              <input type="checkbox" id="checkbox1" />
              <label htmlFor="checkbox1">random</label>
            </div>
          </form>

          <form role="form">
            <div className="checkbox">
              <input type="checkbox" id="checkbox1" />
              <label htmlFor="checkbox1">space</label>
            </div>
          </form>
          <form role="form">
            <div className="checkbox">
              <input type="checkbox" id="checkbox1" />
              <label htmlFor="checkbox1">time</label>
            </div>
          </form>
        </div>

        <div className="buttons-div " id="buttons-div2">
          <span>select status:</span>
          <button
            id="original"
            onClick={handleSamplingClick.bind(null, false)}
            className="btn btn-default btn-sm white-button"
          >
            original
          </button>
          <button
            id="sampling"
            onClick={handleSamplingClick.bind(null, true)}
            className="btn btn-default btn-sm white-button"
          >
            sampling
          </button>
        </div>
        <SliderWithLabel
          name="LDA topics"
          min={1}
          max={20}
          defaultValue={9}
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
