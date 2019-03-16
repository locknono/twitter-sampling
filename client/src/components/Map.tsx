import * as React from "react";
import * as L from "leaflet";
import * as d3 from "d3";
import "leaflet.heat";
/* import "leaflet-webgl-heatmap"; */
import { fetchAndAddGroupLayer } from "../API/mapAPI";
import { colorScale, color } from "../constants";
interface Props {}

interface Map {
  mapRef: any;
  map: L.Map;
}

function Map(props: Props) {
  const [map, setMap] = React.useState<L.Map | null>(null);








  
  React.useEffect(() => {
    const center: [number, number] = [40.74236688190866, -74.01489262003452];
    const zoom = 11.5;
    const preferCanvas = true;
    const zoomControl = false;
    const attributionControl = false;
    const options: object = {
      center,
      zoom,
      zoomControl,
      attributionControl,
      preferCanvas
    };
    const map = L.map("map", options);
    L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).addTo(
      map
    );
    setMap(map);
  }, []);
  return <div id="map" className="panel panel-default" />;
}

export default Map;

async function fetchAndAddLayer() {}
