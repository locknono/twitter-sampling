import * as React from "react";
import * as d3 from "d3";
import { setData, SCATTER_DATA, CLOUD_DATA } from "../actions/setDataAction";
import { setIfDrawCenters, setSelectedIDs } from "../actions/setUIState";
import {
  color,
  padding,
  scatterRadius,
  topicNumber,
  pythonServerURL,
  url
} from "../constants";
import { connect } from "react-redux";
import { useWidthAndHeight } from "src/hooks/layoutHooks";
import { useCtxWithRef } from "src/hooks/canvasHooks";
import { updateQueue } from "../fiber/updateQueue";
import createFiber from "../fiber/fiber";
import * as v4 from "uuid/v4";
import Heading from "../components/Heading";
interface Props {
  scatterData: ScatterPoint[];
  curTopic: CurTopic;
  setData: typeof setData;
  ifDrawScatterCenters: boolean;
  setIfDrawCenters: typeof setIfDrawCenters;
  setSelectedIDs: typeof setSelectedIDs;
  selectedIDs: string[];
  samplingFlag: boolean;
}

const mapState = (state: any) => {
  const { scatterData } = state.dataTree;
  const {
    curTopic,
    ifDrawScatterCenters,
    selectedIDs,
    samplingFlag
  } = state.uiState;
  return {
    scatterData,
    curTopic,
    ifDrawScatterCenters,
    selectedIDs,
    samplingFlag
  };
};
const mapDispatch = {
  setData,
  setIfDrawCenters,
  setSelectedIDs
};

function Texts() {
  return (
    <div className="view-div panel panel-default" id="texts-div">
      <Heading title="texts" />
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(Texts);
