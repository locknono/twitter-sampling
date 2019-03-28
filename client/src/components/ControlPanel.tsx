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
  SAMPLING_CONDITION
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
  const [
    unPatchedSamplingCondition,
    setUnPatchedSamplingCondition
  ] = React.useState(SAMPLING_CONDITION.spaceAndTime);
  const [originalSelectedIDs, setOriginalSelectedIDs] = React.useState<
    string[]
  >([]);
  function handleSystemNameClick(name: "twitter" | "yelp") {
    setCurSystem(name);
  }

  function handleSamplingClick(flag: boolean) {
    setSamplingFlag(flag);

    if (flag == true) {
      setSamplingCondition(unPatchedSamplingCondition);
    }
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

    if (id === "random") {
      setUnPatchedSamplingCondition(SAMPLING_CONDITION.random);
    } else if (id === "bl") {
      setUnPatchedSamplingCondition(SAMPLING_CONDITION.blue);
    } else if (id === "spatial") {
      setUnPatchedSamplingCondition(SAMPLING_CONDITION.space);
    } else if (id === "temporal") {
      setUnPatchedSamplingCondition(SAMPLING_CONDITION.spaceAndTime);
    }
  }
  return (
    <div className="panel panel-default control-panel-div">
      <Heading title="Control Panel" />

      <div className="buttons-div" id="buttons-div2">
        <span>Status:</span>
        <SamplingButton
          id="original"
          text="original"
          clickMethod={handleSamplingClick.bind(null, false)}
        />
        <SamplingButton
          id="sampling"
          text="sampling"
          clickMethod={handleSamplingClick.bind(null, true)}
        />
      </div>

      <div className="control-panel-content-div">
        <div
          className="checkbox-div method-div"
          style={{ position: "relative", top: 10 }}
        >
          <span>Methods:</span>
          <Checkbox id="random" text="random" clickFunc={handleCheck} />
          <Checkbox
            id="bl"
            text="blue noise sampling"
            clickFunc={handleCheck}
          />
        </div>

        <div className="checkbox-div method-div">
          <Checkbox id="rp" text="rapid sampling" clickFunc={handleCheck} />
          <Checkbox id="spatial" text="spatial" clickFunc={handleCheck} />
          <Checkbox id="temporal" text="temporal" clickFunc={handleCheck} />
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
