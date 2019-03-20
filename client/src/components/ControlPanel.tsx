import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";
import { connect } from "react-redux";
import { setData } from "src/actions/setDataAction";
import {
  setIfDrawCenters,
  setSelectedIDs,
  setCurSystem
} from "../actions/setUIState";

interface Props {
  setCurSystem: typeof setCurSystem;
}
const mapState = (state: any) => {
  /* const { scatterData } = state.dataTree;
  const { curTopic, ifDrawScatterCenters, selectedIDs } = state.uiState;
  return { scatterData, curTopic, ifDrawScatterCenters, selectedIDs }; */
  return {};
};
const mapDispatch = {
  setCurSystem
};

function ControlPanel(props: Props) {
  const { setCurSystem } = props;
  function handleTwitterClick() {
    setCurSystem("twitter");
  }
  function handleYelpClick() {
    setCurSystem("yelp");
  }
  return (
    <div className="panel panel-default control-panel-div">
      <Heading title="Control Panel" />
      <p> </p>
      <button id="twitter" onClick={handleTwitterClick}>
        twitter
      </button>
      <button id="yelp" onClick={handleYelpClick}>
        yelp
      </button>
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(ControlPanel);
