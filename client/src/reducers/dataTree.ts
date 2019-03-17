import {
  SET_ORIGINAL_BARDATA,
  SET_SAMPLING_BARDATA,
  SET_SCATTER_DATA,
  SET_DOC_PR_DATA,
  SET_CLOUD_DATA,
  SET_RIVER_DATA,
  SET_MAP_CLASS_POINTS
} from "../actions/setDataAction";

const initialState = {
  originalBarData: [],
  samplingBarData: [],
  scatterData: null,
  ducPrData: null,
  cloudData: null,
  riverData: null,
  mapClassPoints: null
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
      return { ...state, cloudData: action.data };
      break;
    case SET_RIVER_DATA:
      return { ...state, riverData: action.data };
      break;
    case SET_MAP_CLASS_POINTS:
      return { ...state, mapClassPoints: action.data };
    default:
      return state;
  }
}
