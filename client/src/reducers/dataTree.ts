import {
  SET_ORIGINAL_BARDATA,
  SET_SAMPLING_BARDATA,
  SET_SCATTER_DATA
} from "../actions/setDataAction";

const initialState = {
  originalBarData: [],
  samplingBarData: [],
  scatterData: null
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
    default:
      return state;
  }
}
