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
  setSamplingCondition
} from "../actions/setUIState";
import SliderWithLabel from "./SliderWithLabel";
import "../css/awesome-bootstrap-checkbox.css";
import { url } from "src/constants/constants";

interface Props {
  setCurSystem: typeof setCurSystem;
  setSamplingFlag: typeof setSamplingFlag;
  setSamplingCondition: typeof setSamplingCondition;
  samplingCondition: boolean;
  setSelectedIDs: typeof setSelectedIDs;
  selectedIDs: string[];
}
const mapState = (state: any) => {
  const { samplingCondition, selectedIDs } = state.uiState;

  /* const { scatterData } = state.dataTree;
  const { curTopic, ifDrawScatterCenters, selectedIDs } = state.uiState;
  return { scatterData, curTopic, ifDrawScatterCenters, selectedIDs }; */
  return { samplingCondition, selectedIDs };
};
const mapDispatch = {
  setCurSystem,
  setSamplingFlag,
  setSamplingCondition,
  setSelectedIDs
};

function ControlPanel(props: Props) {
  const {
    setCurSystem,
    setSamplingFlag,
    setSamplingCondition,
    samplingCondition,
    setSelectedIDs,
    selectedIDs
  } = props;
  const [spaceChecked, setSpaceChecked] = React.useState(false);
  const [timeChecked, setTimeChecked] = React.useState(false);
  const [originalSelectedIDs, setOriginalSelectedIDs] = React.useState<
    string[]
  >([]);
  function handleSystemNameClick(name: "twitter" | "yelp") {
    setCurSystem(name);
  }

  function handleSamplingClick(flag: boolean) {
    setSamplingFlag(flag);
    if (selectedIDs.length > 0) {
      if (flag === true) {
        (async () => {
          setOriginalSelectedIDs(selectedIDs);
          const res = await fetch(url.ldbrPointsURL);
          const samplingPoints = await res.json();
          const newIDs: string[] = [];
          const selectedIDsSet = new Set(selectedIDs);
          for (let i = 0; i < samplingPoints.length; i++) {
            if (selectedIDsSet.has(samplingPoints[i].id)) {
              newIDs.push(samplingPoints[i].id);
            }
          }
          setSelectedIDs(newIDs);
        })();
      } else {
        setSelectedIDs(originalSelectedIDs);
      }
    }
  }

  function handleCheck(e: React.SyntheticEvent) {
    const id = (e.target as any).id;
    if (id === "space") {
      setSamplingCondition([!samplingCondition[0], samplingCondition[1]]);
    } else {
      setSamplingCondition([samplingCondition[0], !samplingCondition[1]]);
    }
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
              <input type="checkbox" id="space" onChange={handleCheck} />
              <label htmlFor="space">space</label>
            </div>
          </form>
          <form role="form">
            <div className="checkbox">
              <input type="checkbox" id="time" onChange={handleCheck} />
              <label htmlFor="time">time</label>
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
