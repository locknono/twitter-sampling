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

function Texts(props: Props) {
  const [texts, setTexts] = React.useState([]);

  const { selectedIDs } = props;

  React.useEffect(() => {
    (async () => {
      const res = await fetch(pythonServerURL + "getInitialTexts", {
        method: "get",
        mode: "cors",
        cache: "no-cache"
      });
      const texts = await res.json();
      setTexts(texts);
    })();
  }, []);

  React.useEffect(() => {
    if (selectedIDs.length === 0) return;
    (async () => {
      const res = await fetch(pythonServerURL + "getTextsByIDs", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: JSON.stringify(selectedIDs)
      });
      const texts = await res.json();
      setTexts(texts);
    })();
  }, [selectedIDs]);

  let renderTexts;
  renderTexts = texts.map(e => {
    return <li className="list-group-item">{e}</li>;
  });
  return (
    <div className="view-div panel panel-default" id="texts-div">
      <Heading title="texts" />
      <div className="texts-content-div">
        <ul className="list-group texts-ul">{renderTexts}</ul>
      </div>
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(Texts);
