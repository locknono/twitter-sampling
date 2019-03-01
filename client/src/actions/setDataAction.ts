export const SET = "SET";

export const ORIGINAL_BARDATA = "ORIGINAL_BARDATA";
export const SAMPLING_BARDATA = "SAMPLING_BARDATA";

export const SET_ORIGINAL_BARDATA = SET + ORIGINAL_BARDATA;
export const SET_SAMPLING_BARDATA = SET + SAMPLING_BARDATA;

export function setData(dataName: string, data: number[]) {
  return {
    type: SET + dataName,
    data: data
  };
}
