import * as L from "leaflet";
import { color } from "src/constants/constants";
import * as d3 from "d3";

interface ArcData {
  color: string;
  opacity: number | null;
  startAngle: number;
  endAngle?: number;
  innterRadius: number;
  outerRadius: number;
}

export async function fetchAndAddGroupLayer(
  fileName: string,
  layerName: string,
  layerCreatingFunction: Function,
  controlLayer: L.Control.Layers,
  style?: L.CircleMarkerOptions
) {
  const res = await fetch(fileName);
  const data = await res.json();
  const layers: L.Layer[] = [];
  data.map((e: any) => {
    layers.push(layerCreatingFunction(e, style));
  });
  const layerGroup = L.layerGroup(layers);
  controlLayer.addOverlay(layerGroup, layerName);
  return layerGroup;
}

export function getArcDatasByWheelData(
  data: SingleWheelData[],
  meta: { minTime: number; maxTime: number; maxValue: number },
  radius: number,
  layerHeight: number
) {
  const { minTime, maxTime, maxValue } = meta;
  const sliceCount = maxTime - minTime;
  const scale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([0, layerHeight - 2]);
  const opScale = d3
    .scaleLinear()
    .domain([0, (maxValue / 5) * 4])
    .range([0.3, 1]);
  const arcDatas = [];
  for (let i = 0; i < data.length; i++) {
    const singleWheelData = data[i];
    //{innerRadius:number,outerRadius:number,startAngle:number,endAngle:number}
    let arcData: any = {};
    arcData = { color: color.nineColors[i], opacity: null };
    for (let j = minTime; j <= maxTime; j += 1) {
      const value = singleWheelData[j];
      //const height = value === 0 ? 0 : scale(value);
      let angle =
        (Math.PI / 180) * ((360 / sliceCount) * Math.floor(j - minTime));
      if (value > 0) {
        arcData.innerRadius = radius + layerHeight * i;
        arcData.outerRadius = radius + layerHeight * (i + 1) - 3;
        if (!arcData.startAngle) {
          arcData.startAngle = angle;
        }
        if (!arcData.opacity) {
          //arcData.opacity = opScale(value);
          arcData.opacity = 1;
        }
        arcData.endAngle = angle;
      } else {
        if (Object.keys(arcData).length > 2) {
          arcDatas.push(JSON.parse(JSON.stringify(arcData)));
          arcData = { color: color.nineColors[i], opacity: null };
        }
      }
    }
  }
  return arcDatas;
}

export function addArcsToMap(arcDatas: ArcData) {}
