export const SET_CUR_TOPIC = "SET_CUR_TOPIC";
export const IF_DRAW_SCATTER_CENTERS = "IF_DRAW_SCATTER_CENTERS";
export const SET_SELECTED_IDS = "SET_SELECTED_IDS";
export const SET_CUR_SYSTEM = "SET_CUR_SYSTEM";
export const SET_SAMPLING_FLAG = "SET_SAMPLING_FLAG";

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

export function setCurSystem(name: SystemName) {
  return {
    type: SET_CUR_SYSTEM,
    name
  };
}

export function setSamplingFlag(flag: boolean) {
  return {
    type: SET_SAMPLING_FLAG,
    flag
  };
}
