export const SET_CUR_TOPIC = "SET_CUR_TOPIC";
export const IF_DRAW_SCATTER_CENTERS = "IF_DRAW_SCATTER_CENTERS";
export const SET_SELECTED_IDS = "SET_SELECTED_IDS";

export function setCurTopic(index: CurTopic) {
  return {
    type: SET_CUR_TOPIC,
    index
  };
}

export function setIfDrawCenters(flag: boolean) {
  return {
    type: IF_DRAW_SCATTER_CENTERS,
    flag: flag
  };
}

export function setSelectedIDs(ids: string[]) {
  return {
    type: SET_SELECTED_IDS,
    ids
  };
}
