import * as React from "react";
import * as L from "leaflet";
import {
  mapCircleRadius,
  color,
  pythonServerURL,
  url
} from "src/constants/constants";
import { getURLBySamplingCondition } from "src/shared/fetch";
import { SAMPLING_CONDITION } from "src/actions/setUIState";
import * as d3 from "d3";
import { options, tileLayerURL } from "src/constants/mapOptions";

export function usePointsOnMap(
  mapPoints: MapPoint[],
  map: L.Map | null,
  ifShowMapPoints: boolean,
  selectedIDs: string[]
) {
  const [
    pointsLayerGroup,
    setPointsLayerGroup
  ] = React.useState<null | L.LayerGroup<L.Circle>>(null);

  //add all points to map
  React.useEffect(() => {
    if (!mapPoints || !map) return;

    const allPoints: MapPoint[] = [];

    const pointsSet = new Set();
    mapPoints.map(e => {
      const latlngStr = `${e.lat}_${e.lng}`;
      if (pointsSet.has(latlngStr) === false) {
        allPoints.push(e);
        pointsSet.add(latlngStr);
      }
    });
    const allPointsLayer: L.Layer[] = [];
    allPoints.map(e => {
      const id = e.id;
      allPointsLayer.push(
        L.circle(e, {
          radius: mapCircleRadius,
          color: color.mapPointColor
        }).on("mouseover", () => {
          (async function fechText() {
            const res = await fetch(pythonServerURL + "getTextByID", {
              method: "POST",
              mode: "cors",
              cache: "no-cache",
              body: JSON.stringify(id)
            });
            const text = await res.json();
          })();
        })
      );
    });
    if (pointsLayerGroup) {
      map.removeLayer(pointsLayerGroup);
    }
    const layerGroup = L.layerGroup(allPointsLayer);
    setPointsLayerGroup(layerGroup);
    if (ifShowMapPoints) {
      layerGroup.addTo(map);
    }
  }, [mapPoints]);

  React.useEffect(() => {
    if (!pointsLayerGroup || !map) return;
    if (selectedIDs.length !== 0) return;
    if (ifShowMapPoints) {
      pointsLayerGroup.addTo(map);
    } else {
      map.removeLayer(pointsLayerGroup);
    }
  }, [ifShowMapPoints]);

  return [pointsLayerGroup, setPointsLayerGroup];
}

export function useHeat(
  map: L.Map | null,
  ifShowHeatMap: boolean,
  samplingFlag: boolean,
  samplingCondition: SAMPLING_CONDITION
) {
  const [heatLayerGroup, setHeatLayerGroup] = React.useState<any>(null);

  React.useEffect(() => {
    if (!map) return;
    const baseURL = samplingFlag ? url.samplingHeatURL : url.heatURL;
    const newURL = getURLBySamplingCondition(baseURL, samplingCondition);
    fetch(newURL)
      .then(res => res.json())
      .then(data => {
        if (heatLayerGroup) {
          map.removeLayer(heatLayerGroup);
        }
        const heatLayer = (L as any).heatLayer(data, { radius: 15 });
        if (ifShowHeatMap) {
          heatLayer.addTo(map);
        }
        setHeatLayerGroup(heatLayer);
      });
  }, [map, samplingCondition, samplingFlag]);

  React.useEffect(() => {
    if (!map || !heatLayerGroup) return;
    if (ifShowHeatMap) {
      heatLayerGroup.addTo(map);
    } else {
      map.removeLayer(heatLayerGroup);
    }
  }, [ifShowHeatMap]);

  return [heatLayerGroup, setHeatLayerGroup];
}
export function useSvgLayer(map: L.Map | null) {
  const [svgLayer, setSvgLayer] = React.useState<any>(null);
  React.useEffect(() => {
    if (!map) return;
    const svg = L.svg();
    svg.addTo(map);
    const d3Svg = d3.select(".leaflet-overlay-pane svg");
    const g = d3Svg.append("g");
    setSvgLayer(g);
    const initialZoom = (map as any)._zoom;
    const wgsOrigin = L.latLng([0, 0]);
    const wgsInitialShift = map.latLngToLayerPoint(wgsOrigin);
    map.on("zoom", function() {
      const newZoom = (map as any)._zoom;
      const zoomDiff = newZoom - initialZoom;
      const scale = Math.pow(2, zoomDiff);

      const shift = (map.latLngToLayerPoint(L.latLng(0, 0)) as any)._subtract(
        wgsInitialShift.multiplyBy(scale)
      );
      g.attr("transform", `translate(${shift.x},${shift.y}) scale(${scale})`);
    });
  }, [map]);
  return svgLayer;
}

export function useMap() {
  const [map, setMap] = React.useState<L.Map | null>(null);
  React.useEffect(() => {
    const map = L.map("map", options);
    L.tileLayer(tileLayerURL).addTo(map);
    setMap(map);
    map.on("click", function(e) {});
    map.pm.addControls(options);
    //map.pm.enableDraw("Circle", drawOptions as any);
  }, []);
  return map;
}
