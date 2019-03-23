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
        <div>
          <button
            id="twitter"
            className="btn btn-default"
            onClick={handleSystemNameClick.bind(null, "twitter")}
          >
            twitter
          </button>
          <button
            id="yelp"
            onClick={handleSystemNameClick.bind(null, "yelp")}
            className="btn btn-default"
          >
            yelp
          </button>
        </div>
        <div>
          <button
            id="original"
            onClick={handleSamplingClick.bind(null, false)}
            className="btn btn-default"
          >
            original
          </button>
          <button
            id="sampling"
            onClick={handleSamplingClick.bind(null, true)}
            className="btn btn-default"
          >
            sampling
          </button>
        </div>
      </div>
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(ControlPanel);
