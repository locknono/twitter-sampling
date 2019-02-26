import * as L from "leaflet";

function fetchJsonDataInPublicFolder(fileName: string) {
  return fetch(fileName).then(res => res.json());
}

export async function fetchAndAddGroupLayer(
  fileName: string,
  layerName: string,
  layerCreatingFunction: Function,
  controlLayer: L.Control.Layers,
  style?: L.CircleMarkerOptions
) {
  const data: [] = await fetchJsonDataInPublicFolder(fileName);
  const layers: L.Layer[] = [];
  data.map(e => {
    layers.push(layerCreatingFunction(e, style));
  });
  const layerGroup = L.layerGroup(layers);
  controlLayer.addOverlay(layerGroup, layerName);
}
