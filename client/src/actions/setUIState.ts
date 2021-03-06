export const SET_CUR_TOPIC = "SET_CUR_TOPIC";
export const IF_DRAW_SCATTER_CENTERS = "IF_DRAW_SCATTER_CENTERS";
export const SET_SELECTED_IDS = "SET_SELECTED_IDS";
export const SET_CUR_SYSTEM = "SET_CUR_SYSTEM";
export const SET_SAMPLING_FLAG = "SET_SAMPLING_FLAG";
export const SET_IF_SHOW_MAP_POINTS = "SET_IF_SHOW_MAP_POINTS";

//select ids on map => run lda,tsne,sampling on those ids and all other view data view be replaced
export const SET_SELECTED_MAP_IDS = "SET_SELECTED_MAP_IDS";
export const SET_SAMPLING_CONDITION = "SET_SAMPLING_CONDITION";
export const SET_WHEEL_DAY = "SET_WHEEL_DAY";
export const SET_IF_SHOW_HEATMAP = "SET_IF_SHOW_HEATMAP";
export const SET_HOVER_ID = "SET_HOVER_ID";

export enum SAMPLING_CONDITION {
  random = 0,
  blue,
  space,
  spaceAndTime
}

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

export function setIfShowMapPoints(flag: boolean) {
  return {
    type: SET_IF_SHOW_MAP_POINTS,
    flag
  };
}

export function setSelectedMapIDs(ids: string[]) {
  return {
    type: SET_SELECTED_MAP_IDS,
    ids
  };
}

export function setSamplingCondition(condition: SAMPLING_CONDITION) {
  return {
    type: SET_SAMPLING_CONDITION,
    condition
  };
}

export function setWheelDay(day: number) {
  return {
    type: SET_WHEEL_DAY,
    day
  };
}

export function setIfShowHeatMap(flag: boolean) {
  return {
    type: SET_IF_SHOW_HEATMAP,
    flag
  };
}

export function setHoverID(id: string | null) {
  return {
    type: SET_HOVER_ID,
    id
  };
}
