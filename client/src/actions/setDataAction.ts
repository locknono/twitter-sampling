export const SET = "SET";

export const ORIGINAL_BARDATA = "ORIGINAL_BARDATA";
export const SAMPLING_BARDATA = "SAMPLING_BARDATA";
export const SCATTER_DATA = "SCATTER_DATA";
export const DOC_PR_DATA = "DOC_PR_DATA";
export const CLOUD_DATA = "CLOUD_DATA";
export const RIVER_DATA = "RIVER_DATA";
export const MAP_CLASS_POINTS = "MAP_CLASS_POINTS";

export const SET_ORIGINAL_BARDATA = SET + ORIGINAL_BARDATA;
export const SET_SAMPLING_BARDATA = SET + SAMPLING_BARDATA;
export const SET_SCATTER_DATA = SET + SCATTER_DATA;
export const SET_DOC_PR_DATA = SET + DOC_PR_DATA;
export const SET_CLOUD_DATA = SET + CLOUD_DATA;
export const SET_RIVER_DATA = SET + RIVER_DATA;
export const SET_MAP_CLASS_POINTS = SET+MAP_CLASS_POINTS

export function setData(dataName: string, data: any) {
  return {
    type: SET + dataName,
    data: data
  };
}
