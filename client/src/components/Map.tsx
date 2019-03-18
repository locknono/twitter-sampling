import * as React from "react";
import * as L from "leaflet";
import * as d3 from "d3";
import "leaflet.heat";
/* import "leaflet-webgl-heatmap"; */
import { fetchAndAddGroupLayer } from "../API/mapAPI";
import { colorScale, color, pythonServerURL } from "../constants";
import { setData, MAP_CLASS_POINTS } from "../actions/setDataAction";
import { connect } from "react-redux";
import "leaflet.pm";

const mapState = (state: any) => {
  const { mapClassPoints } = state.dataTree;
  const { curTopic, selectedIDs } = state.uiState;
  return { mapClassPoints, curTopic, selectedIDs };
};
const mapDispatch = {
  setData
};

interface Props {
  mapClassPoints: [number, number][][];
  setData: typeof setData;
  curTopic: CurTopic;
  selectedIDs: string[];
}

interface Map {
  mapRef: any;
  map: L.Map;
}

function Map(props: Props) {
  const { mapClassPoints, setData, curTopic, selectedIDs } = props;
  const [map, setMap] = React.useState<L.Map | null>(null);

  const initialControlLayer = L.control.layers(undefined, undefined, {
    collapsed: false
  });
  const [controlLayer, setControlLayer] = React.useState<L.Control.Layers>(
    initialControlLayer
  );

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
            radius: 5,
            color: color.mapPointColor
          })
        );
      });
      const layerGroup = L.layerGroup(layers).addTo(map);
      controlLayer.addOverlay(layerGroup, "selected points");
    })();
  }, [selectedIDs]);
  React.useEffect(() => {
    (async function addAllPoints() {
      const res = await fetch("./allPoints.json");
      const data = await res.json();
      const layers: L.Layer[] = [];
      data.map((e: any) => {
        layers.push(
          L.circle(e, {
            radius: 5,
            color: color.mapPointColor
          })
        );
      });
      const layerGroup = L.layerGroup(layers);
      controlLayer.addOverlay(layerGroup, "all points");
      return layerGroup;
    })();
  }, []);

  React.useEffect(() => {
    (async function addAllPoints() {
      const res = await fetch("./mapClassPoints.json");
      const data = await res.json();
      setData(MAP_CLASS_POINTS, data);
    })();
  }, []);

  //draw class points
  React.useEffect(() => {
    if (curTopic === undefined) return;

    const layers: L.Layer[] = [];
    mapClassPoints[curTopic].map(e => {
      layers.push(
        L.circle(e, {
          radius: 5,
          color: color.nineColors[curTopic]
        })
      );
    });
    const layerGroup = L.layerGroup(layers);
    controlLayer.addOverlay(layerGroup, `points for topic${curTopic}`);
  }, [curTopic]);

  React.useEffect(() => {
    (async function addSamplingPoints() {
      const res = await fetch("./ldbrPoints.json");
      const data = await res.json();
      const layers: L.Layer[] = [];
      data.map((e: any) => {
        layers.push(
          L.circle(e, {
            radius: 5,
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
    map.pm.enableDraw("Circle", drawOptions as any);
  }, []);
  return <div id="map" className="panel panel-default" />;
}

export default connect(
  mapState,
  mapDispatch
)(Map);

async function fetchAndAddLayer() {}
