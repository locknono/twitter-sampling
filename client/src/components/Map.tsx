import * as React from "react";
import * as L from "leaflet";
import * as d3 from "d3";
import "leaflet.heat";
/* import "leaflet-webgl-heatmap"; */
import { fetchAndAddGroupLayer } from "../API/mapAPI";
import {
  colorScale,
  color,
  pythonServerURL,
  url,
  topicNumber,
  mapCircleRadius
} from "../constants";
import { setData, MAP_POINTS, CLOUD_DATA } from "../actions/setDataAction";
import { connect } from "react-redux";
import "leaflet.pm";
import { setSelectedIDs } from "../actions/setUIState";

const mapState = (state: any) => {
  const { mapPoints } = state.dataTree;
  const { curTopic, selectedIDs, systemName } = state.uiState;
  return { mapPoints, curTopic, selectedIDs, systemName };
};
const mapDispatch = {
  setData,
  setSelectedIDs
};

interface Props {
  mapPoints: MapPoints;
  setData: typeof setData;
  curTopic: CurTopic;
  selectedIDs: string[];
  setSelectedIDs: typeof setSelectedIDs;
  systemName: SystemName;
}

interface Map {
  mapRef: any;
  map: L.Map;
}

function Map(props: Props) {
  const {
    mapPoints,
    setData,
    curTopic,
    selectedIDs,
    setSelectedIDs,
    systemName
  } = props;
  const [
    lastSelectedLayer,
    setLastSelectedLayer
  ] = React.useState<L.Layer | null>(null);
  const [map, setMap] = React.useState<L.Map | null>(null);

  const initialControlLayer = L.control.layers(undefined, undefined, {
    collapsed: false
  });
  const [controlLayer, setControlLayer] = React.useState<L.Control.Layers>(
    initialControlLayer
  );

  //set map points
  React.useEffect(() => {
    (async function setMapPoints() {
      const res = await fetch(url.mapPointsURL);
      const mapPoints = await res.json();
      setData(MAP_POINTS, mapPoints);
    })();
  }, []);

  //draw selected ids
  React.useEffect(() => {
    if (!map) return;

    (async function drawSelectedIDs() {
      const res = await fetch(pythonServerURL + "getCoorsByIDs", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: JSON.stringify(selectedIDs)
      });
      const data = await res.json();
      const layers: L.Layer[] = [];
      data.map((e: any) => {
        layers.push(
          L.circle(e, {
            radius: mapCircleRadius,
            color: color.mapPointColor
          })
        );
      });
      const layerGroup = L.layerGroup(layers).addTo(map);
      controlLayer.addOverlay(layerGroup, "selected points");
      if (lastSelectedLayer) {
        controlLayer.removeLayer(lastSelectedLayer);
        map.removeLayer(lastSelectedLayer);
      }
      setLastSelectedLayer(layerGroup);
    })();
  }, [selectedIDs]);

  React.useEffect(() => {
    if (!mapPoints) return;
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
            //console.log("text: ", text);
          })();
        })
      );
    });
    const layerGroup = L.layerGroup(allPointsLayer);
    controlLayer.addOverlay(layerGroup, `all points`);
  }, [mapPoints]);

  React.useEffect(() => {
    if (!mapPoints) return;
    const allPointsLayer: L.Layer[] = [];
    mapPoints.map(e => {
      allPointsLayer.push(
        L.circle(e, {
          radius: mapCircleRadius,
          color: color.nineColors[e.topic]
        })
      );
    });
    const layerGroup = L.layerGroup(allPointsLayer);
    controlLayer.addOverlay(layerGroup, `all points with topic`);
  }, [mapPoints]);

  React.useEffect(() => {
    if (!mapPoints) return;
    const allTopicPoints: MapPoint[][] = [];
    for (let i = 0; i < topicNumber; i++) {
      allTopicPoints.push([]);
    }
    mapPoints.map(e => {
      allTopicPoints[e.topic].push(e);
    });
    allTopicPoints.map((e, i) => {
      const curTopicPointsLayer: L.Layer[] = [];
      e.map(v => {
        curTopicPointsLayer.push(
          L.circle(v, {
            radius: mapCircleRadius,
            color: color.nineColors[i]
          })
        );
      });
      const layerGroup = L.layerGroup(curTopicPointsLayer);
      controlLayer.addOverlay(layerGroup, `points for topic${i}`);
    });
  }, [mapPoints]);

  React.useEffect(() => {
    (async function addSamplingPoints() {
      const res = await fetch(url.ldbrPointsURL);
      const data = await res.json();
      const layers: L.Layer[] = [];
      data.map((e: any) => {
        layers.push(
          L.circle(e, {
            radius: mapCircleRadius,
            color: color.mapPointColor
          })
        );
      });
      const layerGroup = L.layerGroup(layers);
      controlLayer.addOverlay(layerGroup, "sampling points");
    })();
  }, []);

  /*  for (let i = 0; i < 10; i++) {
  fetch(`./heatmapData/heat-${i}.json`)
    .then(res => res.json())
    .then(data => {
      var heatmap = new (L as any).WebGLHeatMap({
        size: 500,
        autoresize: true
      });
      heatmap.setData(data);
      controlLayer.addOverlay(heatmap, `heatmap-${i}`);


      //const heatLayer = (L as any).heatLayer(data, { radius: 15 });
      //controlLayer.addOverlay(heatLayer, `heatmap-${i}`);
    });
}*/

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
    map.on("click", function(e) {});
    controlLayer.addTo(map);

    const p1: [number, number] = [40.9328129198744, -74.32278448250146];
    const p2: [number, number] = [40.49040846908216, -73.73446653597058];
    const bounds = [p1, p2];
    const bound = L.rectangle(bounds);
    controlLayer.addOverlay(bound, "bound");

    const pmOptions = {
      position: "topleft", // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
      useFontAwesome: false, // use fontawesome instead of glyphicons (you need to include fontawesome yourself)
      drawMarker: true, // adds button to draw markers
      drawPolyline: true, // adds button to draw a polyline
      drawRectangle: true, // adds button to draw a rectangle
      drawPolygon: true, // adds button to draw a polygon
      drawCircle: true, // adds button to draw a cricle
      cutPolygon: true, // adds button to cut a hole in a polygon
      editMode: true, // adds button to toggle edit mode for all layers
      removalMode: true // adds a button to remove layers
    };
    const drawOptions = {
      snappable: true,
      snapDistance: 20,
      snapMiddle: false,
      allowSelfIntersection: true,
      templineStyle: {
        color: "blue"
      },
      hintlineStyle: {
        color: "blue",
        dashArray: [5, 5]
      },
      cursorMarker: false,
      finishOn: null,
      markerStyle: {
        fillColor: "none",
        stroke: "blue",
        opacity: 0,
        draggable: true,
        pointerEvents: `none`
      },
      pathOptions: {
        fill: "blue",
        fillOpacity: 0,
        color: "blue",
        fillColor: "none",
        pointerEvents: `none`
      }
    };
    map.pm.addControls(options);
    //map.pm.enableDraw("Circle", drawOptions as any);
  }, []);

  React.useEffect(() => {
    if (!map) return;
    map.on("pm:create", function(e1: any) {
      if (!mapPoints) return;
      const radius = e1.layer._radius;
      const center: [number, number] = [
        e1.layer._latlng.lat,
        e1.layer._latlng.lng
      ];
      const ids: string[] = [];
      mapPoints.map(e => {
        if (ifInside([e.lat, e.lng], center, radius, map)) {
          ids.push(e.id);
        }
      });
      setSelectedIDs(ids);

      (async function setWordCloudDataWithSelectedIDs(ids: string[]) {
        if (ids.length === 0) return;
        const res = await fetch(pythonServerURL + "selectArea", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          body: JSON.stringify(ids)
        });
        const data = await res.json();
        setData(CLOUD_DATA, data);
      })(ids);
    });
  }, [mapPoints]);

  React.useEffect(() => {
    if (!map) return;
    if (systemName === "yelp") {
      map.panTo([40.41433253092038, -79.9775848304853]);
    } else {
      map.panTo([40.74236688190866, -74.01489262003452]);
    }
  }, [systemName]);
  return <div id="map" className="panel panel-default" />;
}

export default connect(
  mapState,
  mapDispatch
)(Map);

async function fetchAndAddLayer() {}

function ifInside(
  p: [number, number],
  c: [number, number],
  r: number,
  map: L.Map
) {
  const dis = Math.sqrt(
    Math.pow(map.latLngToLayerPoint(p).x - map.latLngToLayerPoint(c).x, 2) +
      Math.pow(map.latLngToLayerPoint(p).y - map.latLngToLayerPoint(c).y, 2)
  );
  if (dis <= r) {
    return true;
  } else {
    return false;
  }
}
