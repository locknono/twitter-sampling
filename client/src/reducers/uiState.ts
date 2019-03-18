import {
  SET_CUR_TOPIC,
  IF_DRAW_SCATTER_CENTERS,
  SET_SELECTED_IDS
} from "../actions/setUIState";

interface UIState {
  curTopic: CurTopic;
  ifDrawScatterCenters: boolean;
  selectedIDs: string[];
}

const initialState: UIState = {
  curTopic: undefined,
  ifDrawScatterCenters: false,
  selectedIDs: []
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
    default:
      return state;
  }
}
