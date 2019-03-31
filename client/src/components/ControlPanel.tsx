import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";
import { connect } from "react-redux";
import { setData, MAP_POINTS } from "src/actions/setDataAction";
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
import { getURLBySamplingCondition } from "src/shared/fetch";
interface Props {
  setCurSystem: typeof setCurSystem;
  setSamplingFlag: typeof setSamplingFlag;
  setSamplingCondition: typeof setSamplingCondition;
  samplingCondition: SAMPLING_CONDITION;
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

  const [ifRandomChecked, setIfRandomChecked] = React.useState(false);
  const [ifBlueChecked, setIfBlueChecked] = React.useState(false);
  const [ifRapidChecked, setIfRapidChecked] = React.useState(false);
  const [ifSpaceChecked, setIfSpaceChecked] = React.useState(false);
  const [ifTimeChecked, setIfTimeChecked] = React.useState(false);

  function handleSystemNameClick(name: "twitter" | "yelp") {
    setCurSystem(name);
  }

  function handleSamplingClick(flag: boolean) {
    setSamplingFlag(flag);

    if (flag == true) {
      setSamplingCondition(unPatchedSamplingCondition);
    } else {
      setSamplingCondition(SAMPLING_CONDITION.spaceAndTime);
      closeOurMethod();
      closeCompareMethod();
    }

    if (selectedIDs.length > 0) {
      if (flag === true) {
        (async () => {
          setOriginalSelectedIDs(selectedIDs);
          const conditionURL = getURLBySamplingCondition(
            url.ldbrPointsURL,
            samplingCondition
          );
          const res = await fetch(conditionURL);
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

  function closeOurMethod() {
    setIfRapidChecked(false);
    setIfSpaceChecked(false);
    setIfTimeChecked(false);
  }
  function closeCompareMethod() {
    setIfRandomChecked(false);
    setIfBlueChecked(false);
  }
  function handleCheck(e: React.SyntheticEvent) {
    const id = (e.target as any).id;
    if (id === "random") {
      setIfRandomChecked(!ifRandomChecked);
      setIfBlueChecked(false);
      closeOurMethod();
    } else if (id === "bl") {
      setIfBlueChecked(!ifBlueChecked);
      setIfRandomChecked(false);
      closeOurMethod();
    } else if (id === "spatial") {
      closeCompareMethod();
      setIfSpaceChecked(!ifSpaceChecked);
      setIfRapidChecked(true);
    } else if (id === "temporal") {
      closeCompareMethod();
      if (ifTimeChecked === false) {
        setIfSpaceChecked(true);
      }
      setIfTimeChecked(!ifTimeChecked);
      setIfRapidChecked(true);
    } else if (id === "rp") {
      if (ifRapidChecked === false) {
        setIfSpaceChecked(true);
        setIfTimeChecked(true);
        closeCompareMethod();
      } else {
        setIfSpaceChecked(false);
        setIfTimeChecked(false);
      }
      setIfRapidChecked(!ifRapidChecked);
    }
  }

  React.useEffect(() => {
    if (ifRandomChecked) {
      setUnPatchedSamplingCondition(SAMPLING_CONDITION.random);
    } else if (ifBlueChecked) {
      setUnPatchedSamplingCondition(SAMPLING_CONDITION.blue);
    } else if (ifSpaceChecked && !ifTimeChecked) {
      setUnPatchedSamplingCondition(SAMPLING_CONDITION.space);
    } else if (ifSpaceChecked && ifTimeChecked) {
      setUnPatchedSamplingCondition(SAMPLING_CONDITION.spaceAndTime);
    } else if (!ifSpaceChecked && ifTimeChecked) {
      setUnPatchedSamplingCondition(SAMPLING_CONDITION.spaceAndTime);
    }
  }, [
    ifRandomChecked,
    ifBlueChecked,
    ifSpaceChecked,
    ifTimeChecked,
    ifRapidChecked
  ]);

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
          <Checkbox
            id="random"
            text="random"
            clickFunc={handleCheck}
            ifChecked={ifRandomChecked}
          />
          <Checkbox
            id="bl"
            text="blue noise sampling"
            clickFunc={handleCheck}
            ifChecked={ifBlueChecked}
          />
        </div>

        <div
          className="checkbox-div method-div"
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Checkbox
            id="rp"
            text="semantics"
            clickFunc={handleCheck}
            ifChecked={ifRapidChecked}
          />
          <Checkbox
            id="spatial"
            text="spatial"
            clickFunc={handleCheck}
            ifChecked={ifSpaceChecked}
          />
          <Checkbox
            id="temporal"
            text="temporal"
            clickFunc={handleCheck}
            ifChecked={ifTimeChecked}
          />
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
          name="Disk radius"
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
