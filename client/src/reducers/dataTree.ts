import {
  SET_ORIGINAL_BARDATA,
  SET_SAMPLING_BARDATA
} from "../actions/setDataAction";

const initialState = {};
export default function dataTree(state = initialState, action: any) {
  switch (action.type) {
    case SET_ORIGINAL_BARDATA:
      return { ...state, originalBarData: action.data };
      break;
    case SET_SAMPLING_BARDATA:
      return { ...state, weightList: action.weightList };
      break;
    default:
      return state;
  }
}
