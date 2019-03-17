import { SET_CUR_TOPIC, IF_DRAW_SCATTER_CENTERS } from "../actions/setUIState";

interface UIState {
  curTopic: CurTopic;
  ifDrawScatterCenters: boolean;
}

const initialState: UIState = {
  curTopic: undefined,
  ifDrawScatterCenters: false
};

export function uiState(state = initialState, action: any) {
  switch (action.type) {
    case SET_CUR_TOPIC:
      return { ...state, curTopic: action.index };
      break;
    case IF_DRAW_SCATTER_CENTERS:
      return { ...state, ifDrawScatterCenters: action.flag };
      break;
    default:
      return state;
  }
}
