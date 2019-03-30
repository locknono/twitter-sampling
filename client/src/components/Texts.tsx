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
} from "../constants/constants";
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
  texts: Text[];
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
        if (ok) {
          const texts = await res.json();
          setData(TEXTS, texts);
          setIfFetchSuccess(true);
        }
      } catch (error) {
        setIfFetchSuccess(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (selectedIDs.length === 0) return;
    (async () => {
      try {
        const res = await fetch(pythonServerURL + "getTextsByIDs", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          body: JSON.stringify(selectedIDs)
        });
        const texts = await res.json();
        setData(TEXTS, texts);
        setIfFetchSuccess(true);
      } catch (e) {
        setIfFetchSuccess(false);
      }
    })();
  }, [selectedIDs]);

  const imgIndices = [];
  for (let i = 0; i < 20; i++) {
    imgIndices.push(i);
  }
  const shuffledIndices = shuffle(imgIndices);
  let renderTexts;
  if (ifFetchSuccess === false) {
    renderTexts = <div>!!!START SERVER!!!</div>;
  } else {
    renderTexts = texts.map((e, i) => {
      if (i > 50) return;
      return (
        <SingleText
          key={v4()}
          text={e.text}
          index={shuffledIndices[i % 20]}
          id={e.id}
          time={e.time}
        />
      );
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

function shuffle(input: number[]) {
  for (let i = input.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const itemAtIndex = input[randomIndex];
    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
}
