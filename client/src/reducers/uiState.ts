import {
  SET_CUR_TOPIC,
  IF_DRAW_SCATTER_CENTERS,
  SET_SELECTED_IDS,
  SET_CUR_SYSTEM,
  SET_SAMPLING_FLAG,
  SET_IF_SHOW_MAP_POINTS,
  SET_SELECTED_MAP_IDS,
  SET_SAMPLING_CONDITION
} from "../actions/setUIState";

import { setData, CLOUD_DATA } from "../actions/setDataAction";
import { pythonServerURL } from "../constants";
interface UIState {
  curTopic: CurTopic;
  ifDrawScatterCenters: boolean;
  selectedIDs: string[];
  systemName: SystemName;
  samplingFlag: boolean;
  ifShowMapPoints: boolean;
  selectedMapIDs: string[];
  samplingCondition: [boolean, boolean];
}

const initialState: UIState = {
  curTopic: undefined,
  ifDrawScatterCenters: false,
  selectedIDs: [],
  systemName: "yelp",
  samplingFlag: false,
  ifShowMapPoints: false,
  selectedMapIDs: [],
  samplingCondition: [false, false]
};

export function uiState(state = initialState, action: any) {
  switch (action.type) {
    case SET_CUR_TOPIC:
      return { ...state, curTopic: action.index };
      break;
    case IF_DRAW_SCATTER_CENTERS:
      return { ...state, ifDrawScatterCenters: action.flag };
      break;
    case SET_SELECTED_IDS:
      return { ...state, selectedIDs: action.ids };
      break;
    case SET_CUR_SYSTEM:
      return { ...state, systemName: action.name };
      break;
    case SET_SAMPLING_FLAG:
      return { ...state, samplingFlag: action.flag };
      break;
    case SET_IF_SHOW_MAP_POINTS:
      return { ...state, ifShowMapPoints: action.flag };
      break;
    case SET_SELECTED_MAP_IDS:
      return { ...state, selectedMapIDs: action.ids };
      break;
    case SET_SAMPLING_CONDITION:
      return { ...state, samplingCondition: action.condition };
      break;
    default:
      return state;
  }
}
