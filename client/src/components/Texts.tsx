import * as React from "react";
import * as d3 from "d3";
import {
  setData,
  SCATTER_DATA,
  CLOUD_DATA,
  SET_TEXTS,
  TEXTS
} from "../actions/setDataAction";
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
import SingleText from "./SingleText";

interface Props {
  curTopic: CurTopic;
  setData: typeof setData;
  setIfDrawCenters: typeof setIfDrawCenters;
  setSelectedIDs: typeof setSelectedIDs;
  selectedIDs: string[];
  samplingFlag: boolean;
  texts: string[];
}

const mapState = (state: any) => {
  const { texts } = state.dataTree;
  const { curTopic, selectedIDs, samplingFlag } = state.uiState;
  return {
    curTopic,
    selectedIDs,
    samplingFlag,
    texts
  };
};
const mapDispatch = {
  setData,
  setIfDrawCenters,
  setSelectedIDs
};

function Texts(props: Props) {
  const { texts, setData } = props;
  console.log("texts: ", texts);

  const { selectedIDs } = props;

  const [ifFetchSuccess, setIfFetchSuccess] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(pythonServerURL + "getInitialTexts", {
          method: "get",
          mode: "cors",
          cache: "no-cache"
        });
        const ok = res.ok;
        const texts = await res.json();
        setData(TEXTS, texts);
        setIfFetchSuccess(true);
      } catch (error) {
        setIfFetchSuccess(false);
      }
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
      setData(TEXTS, texts);
      setIfFetchSuccess(true);
    })();
  }, [selectedIDs]);

  let renderTexts;
  if (ifFetchSuccess === false) {
    renderTexts = <div>!!!START SERVER!!!</div>;
  } else {
    renderTexts = texts.map((e, i) => {
      if (i > 50) return;
      return <SingleText key={v4()} text={e} index={i} />;
    });
  }
  return (
    <div className="view-div panel panel-default" id="texts-div">
      <Heading title="Text Information" />
      <div className="texts-content-div"> </div>
      <div className="list-group"> {renderTexts}</div>
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(Texts);
