import * as L from "leaflet";

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
