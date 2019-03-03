export const SET = "SET";

export const ORIGINAL_BARDATA = "ORIGINAL_BARDATA";
export const SAMPLING_BARDATA = "SAMPLING_BARDATA";

export const SCATTER_DATA = "SCATTER_DATA";

export const SET_ORIGINAL_BARDATA = SET + ORIGINAL_BARDATA;
export const SET_SAMPLING_BARDATA = SET + SAMPLING_BARDATA;
export const SET_SCATTER_DATA = SET + SCATTER_DATA;

export function setData(dataName: string, data: number[]) {
  return {
    type: SET + dataName,
    data: data
  };
}
