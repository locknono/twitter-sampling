import { pythonServerURL } from "src/constants/constants";

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
