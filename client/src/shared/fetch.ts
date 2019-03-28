import { pythonServerURL } from "src/constants/constants";
import { SAMPLING_CONDITION } from "src/actions/setUIState";

export async function fetchWordCloudDataByIDs(ids: string[]) {
  if (ids.length === 0) return;
  try {
    const res = await fetch(pythonServerURL + "selectArea", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      body: JSON.stringify(ids)
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}

export function getURLBySamplingCondition(
  url: string,
  samplingCondition: SAMPLING_CONDITION
) {
  switch (samplingCondition) {
    case SAMPLING_CONDITION.random:
      return url.replace("./", "./random/");
      break;
    case SAMPLING_CONDITION.blue:
      return url.replace("./", "./blue/");
      break;
    case SAMPLING_CONDITION.space:
      return url.replace("./", "./space/");
      break;
    case SAMPLING_CONDITION.spaceAndTime:
      return url;
      break;
    default:
      return url;
      break;
  }
}
