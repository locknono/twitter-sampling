import * as d3 from "d3";
import { maxCloudWordSize } from "src/constants/constants";

import {
  SET_ORIGINAL_BARDATA,
  SET_SAMPLING_BARDATA,
  SET_SCATTER_DATA,
  SET_DOC_PR_DATA,
  SET_CLOUD_DATA,
  SET_RIVER_DATA,
  SET_MAP_POINTS,
  SET_SAMPLING_RIVER_DATA,
  SET_TEXTS,
  SET_WHEEL_DATA
} from "../actions/setDataAction";

const initialState = {
  originalBarData: [],
  samplingBarData: [],
  scatterData: null,
  ducPrData: null,
  cloudData: null,
  riverData: null,
  mapPoints: null,
  samplingRiverData: null,
  texts: [],
  wheelData: null
};

export default function dataTree(state = initialState, action: any) {
  switch (action.type) {
    case SET_ORIGINAL_BARDATA:
      return { ...state, originalBarData: action.data };
      break;
    case SET_SAMPLING_BARDATA:
      return { ...state, samplingBarData: action.data };
      break;
    case SET_SCATTER_DATA:
      return { ...state, scatterData: action.data };
      break;
    case SET_DOC_PR_DATA:
      return { ...state, docPrData: action.data };
      break;
    case SET_CLOUD_DATA:
      return { ...state, cloudData: normCloudSize(action.data) };
      break;
    case SET_RIVER_DATA:
      return { ...state, riverData: action.data };
      break;
    case SET_MAP_POINTS:
      return { ...state, mapPoints: action.data };
    case SET_SAMPLING_RIVER_DATA:
      return { ...state, samplingRiverData: action.data };
    case SET_TEXTS:
      return { ...state, texts: action.data };
    case SET_WHEEL_DATA:
      return { ...state, wheelData: action.data };
    default:
      return state;
  }
}

function normCloudSize(cloudData: any) {
  const logFunc = Math.floor;
  for (let i = 0; i < cloudData.length; i++) {
    const curTopicWords = cloudData[i];
    let maxFre = -1;
    let minFre = Number.MAX_SAFE_INTEGER;
    for (let j = 0; j < curTopicWords.length; j++) {
      if (logFunc(curTopicWords[j].fre) > maxFre) {
        maxFre = logFunc(curTopicWords[j].fre);
      }
      if (logFunc(curTopicWords[j].fre) < minFre) {
        minFre = logFunc(curTopicWords[j].fre);
      }
    }
    const fontSizeScale = d3
      .scaleLinear()
      .domain([minFre, maxFre])
      .range([0, maxCloudWordSize])
      .clamp(true);
    for (let j = 0; j < curTopicWords.length; j++) {
      curTopicWords[j].size = fontSizeScale(logFunc(curTopicWords[j].fre));
    }
  }
  return cloudData;
}
