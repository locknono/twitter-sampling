import { SET_CUR_TOPIC } from "../actions/setUIState";

interface UIState {
  curTopic: number | undefined;
}

const initialState: UIState = { curTopic: undefined };

export function uiState(state = initialState, action: any) {
  switch (action.type) {
    case SET_CUR_TOPIC:
      return { ...state, curTopic: action.index };
      break;
    default:
      return state;
  }
}
