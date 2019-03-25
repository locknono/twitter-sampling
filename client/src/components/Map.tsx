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

  const [wheelCenter, setWheelCenter] = React.useState<any>(null);

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

  React.useEffect(() => {
    if (!map || !wheelCenter) return;
    const d3Svg = d3.select(".leaflet-overlay-pane svg").select("g");
  }, [map, wheelCenter]);
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

  /* React.useEffect(() => {
    if (!mapPoints) return;
    for (let i = 0; i < topicNumber; i++) {
      const curTopicPoints = mapPoints.filter(e => e.topic === i);
      const curTopicPointsLayer: L.Layer[] = [];
      curTopicPoints.map(e => {
        curTopicPointsLayer.push(
          L.circle(e, {
            radius: mapCircleRadius,
            color: color.nineColors[i]
          })
        );
      });
      const layerGroup = L.layerGroup(curTopicPointsLayer);
      controlLayer.addOverlay(layerGroup, `points for topic${i}`);
    }
  }, [mapPoints]); */

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
    if (!map || !svgLayer) return;
    let lastW: any = null;
    map.on("pm:create", function(e1: any) {
      if (!mapPoints) return;
      const layer = e1.layer;
      if (!lastW) {
        lastW = layer;
      } else {
        map.removeLayer(lastW);
        lastW = layer;
      }

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
        try {
          const res = await fetch(pythonServerURL + "selectArea", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            body: JSON.stringify(ids)
          });
          const data = await res.json();
          setData(CLOUD_DATA, data);
        } catch (e) {}
      })(ids);

      (async function drawWheel() {
        try {
          const fetch1 = fetch("./wheelData.json");
          const fetch2 = fetch("./wheelDataMeta.json");
          const res1 = await fetch1;
          const res2 = await fetch2;
          const data: WheelData = await res1.json();

          const meta = await res2.json();
          const { minTime, maxTime, maxValue, pad } = meta;
          console.log("meta: ", meta);

          const sliceCount = (maxTime - minTime) / pad;

          const layerHeight = 10;
          const scale = d3
            .scaleLinear()
            .domain([0, maxValue])
            .range([0, layerHeight]);

          const arc = d3
            .arc()
            .innerRadius(function(d) {
              return d.innerRadius;
            })
            .outerRadius(function(d) {
              return d.outerRadius;
            })
            .startAngle(function(d) {
              return d.startAngle;
            })
            .endAngle(function(d) {
              return d.endAngle;
            });

          const cx = e1.layer._point.x;
          const cy = e1.layer._point.y;

          const curWheelCenter = [e1.layer._point.x, e1.layer._point.y];
          console.log("curWheelCenter: ", curWheelCenter);
          setWheelCenter(curWheelCenter);

          for (let i = 0; i < data.length; i++) {
            const layerArc = {
              innerRadius: radius + layerHeight * i,
              outerRadius: radius + layerHeight * (i + 1),
              startAngle: 0,
              endAngle: Math.PI * 2
            };
            svgLayer
              .append("path")
              .attr("d", arc(layerArc))
              .attr("stroke", color.nineColors[i])
              .attr("stroke-width", "0.1psx")
              .attr("fill", "none")
              .attr(
                "transform",
                `translate(${e1.layer._point.x},${e1.layer._point.y})`
              );
            const singleWheelData = data[i];
            //{innerRadius:number,outerRadius:number,startAngle:number,endAngle:number}
            let arcData: any = {};
            for (let j = minTime; j <= maxTime; j += pad) {
              const value = singleWheelData[j];
              const height = value === 0 ? 0 : scale(value);
              let angle =
                (Math.PI / 180) *
                ((360 / sliceCount) * Math.floor((j - minTime) / pad));
              if (value > 0) {
                arcData.innerRadius = radius + layerHeight * i;
                arcData.outerRadius = radius + layerHeight * i + height;
                if (!arcData.startAngle) {
                  arcData.startAngle = angle;
                }
                arcData.endAngle = angle;
              } else {
                if (Object.keys(arcData).length > 0) {
                  if (i === 0) {
                    console.log("arcData: ", arcData);
                  }
                  svgLayer
                    .append("path")
                    .attr("d", arc(arcData))
                    .attr("stroke", color.nineColors[i])
                    .attr("stroke-width", "0.1psx")
                    .attr("fill", color.nineColors[i])
                    .attr(
                      "transform",
                      `translate(${curWheelCenter[0]},${curWheelCenter[1]})`
                    );
                  arcData = {};
                }
              }
            }
          }
        } catch (e) {}
      })();
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

  React.useEffect(() => {
    (async function addSamplingPoints() {
      const res = await fetch(url.hexURL);
      const data = await res.json();
      const layers: L.Layer[] = [];
      const minvalue = d3.min(data, function(e: any) {
        return e.value as number;
      }) as number;

      const maxValue = d3.max(data, function(e: any) {
        return e.value as number;
      }) as number;
      const logFunc = Math.floor;
      const valueScale = d3
        .scaleLinear()
        .domain([logFunc(minvalue), logFunc(maxValue)])
        .range([0, 1]);

      data.map((e: any) => {
        if (e.value === 0) {
          return;
        }
        layers.push(
          L.polygon(e.path, {
            stroke: false,
            fillColor: color.hexColorScale(valueScale(logFunc(e.value))),
            fillOpacity: 0.8
          })
        );
      });
      const layerGroup = L.layerGroup(layers);
      controlLayer.addOverlay(layerGroup, "original hex");
    })();
  }, []);
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
