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
  mapPoints: MapPoint[];
  hoverID: string | null;
}

const mapState = (state: any) => {
  const { texts, mapPoints } = state.dataTree;
  const { curTopic, selectedIDs, samplingFlag, hoverID } = state.uiState;
  return {
    curTopic,
    selectedIDs,
    samplingFlag,
    texts,
    mapPoints,
    hoverID
  };
};
const mapDispatch = {
  setData,
  setIfDrawCenters,
  setSelectedIDs
};

function Texts(props: Props) {
  const { texts, setData, curTopic, mapPoints, hoverID } = props;

  const { selectedIDs } = props;

  const [ifFetchSuccess, setIfFetchSuccess] = React.useState(false);

  const textsRef = React.useRef<null | HTMLDivElement>(null);

  const [renderTextCount, setRenderTextCount] = React.useState(20);

  const [imgIndices, setImgIndices] = React.useState<number[]>([]);

  const [hoverText, setHoverText] = React.useState<any>();
  function handleScroll(e: React.SyntheticEvent) {
    if (!textsRef.current) return;
    const el = textsRef.current;
    if (el.scrollTop + el.clientHeight > el.scrollHeight * 0.8) {
      setRenderTextCount(renderTextCount + 10);
    }
  }

  React.useEffect(() => {
    console.log("hoverID: ", hoverID);
    if (hoverID === null) {
      setHoverText(null);
      return;
    }
    (async () => {
      const res = await fetch(pythonServerURL + "getTextByID", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(hoverID)
      });
      const data = await res.json();
      setHoverText(data);
    })();
  }, [hoverID]);

  React.useEffect(() => {
    const indx = [];
    for (let i = 0; i < 30; i++) {
      indx.push(i);
    }
    const shuffledIndices = shuffle(indx);
    setImgIndices(shuffledIndices);
  }, [texts]);

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
    fetchTextsByIDs(selectedIDs);
  }, [selectedIDs]);

  //topic texts
  React.useEffect(() => {
    if (!mapPoints) return;
    const topicIDs: string[] = [];
    mapPoints.map(e => {
      if (e.topic !== curTopic) return;
      topicIDs.push(e.id);
    });
    fetchTextsByIDs(topicIDs);
  }, [curTopic]);

  async function fetchTextsByIDs(ids: string[]) {
    try {
      const res = await fetch(pythonServerURL + "getTextsByIDs", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: JSON.stringify(ids)
      });
      const texts = await res.json();
      const findDayRegx = /\d\s/g;
      console.log("texts: ", texts);
      texts.sort((a: any, b: any) => {
        //2016-11-12 12:00:00
        /*  return (
          parseInt(a.time.match(findDayRegx)[0].trim()) -
          parseInt(b.time.match(findDayRegx)[0].trim())
        ); */
      });
      setData(TEXTS, texts);
      setIfFetchSuccess(true);
    } catch (e) {
      console.log(e);
      setIfFetchSuccess(false);
    }
  }

  let renderTexts;
  if (ifFetchSuccess === false) {
    renderTexts = <div>!!!START SERVER!!!</div>;
  } else {
    renderTexts = texts.map((e, i) => {
      if (i > renderTextCount) return;
      return (
        <SingleText
          key={e.text}
          text={e.text}
          index={imgIndices[i % 30]}
          id={e.id}
          time={e.time}
        />
      );
    });
  }
  const renderHoverText = hoverText ? (
    <SingleText
      key={hoverText.text}
      text={hoverText.text}
      index={imgIndices[Math.floor(Math.random() * 30)]}
      id={hoverText.id}
      time={hoverText.time}
      background="rgba(222,222,222,0.5)"
    />
  ) : null;
  return (
    <div className="view-div panel panel-default" id="texts-div">
      <Heading title="Text Information" />
      <div className="texts-content-div"> </div>
      <div className="list-group" onScroll={handleScroll} ref={textsRef}>
        {renderHoverText}
        {renderTexts}
      </div>
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
