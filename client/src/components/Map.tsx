import * as React from "react";
import * as L from "leaflet";
import * as d3 from "d3";
import "leaflet.heat";
/* import "leaflet-webgl-heatmap"; */
import { fetchAndAddGroupLayer, getArcDatasByWheelData } from "../API/mapAPI";
import {
  colorScale,
  color,
  pythonServerURL,
  url,
  topicNumber,
  mapCircleRadius,
  wheelLayerHeight
} from "../constants/constants";
import { tl, rb, options, tileLayerURL } from "src/constants/mapOptions";
import {
  setData,
  MAP_POINTS,
  CLOUD_DATA,
  SCATTER_DATA,
  RIVER_DATA,
  SAMPLING_RIVER_DATA
} from "../actions/setDataAction";
import { connect, ReactReduxContext } from "react-redux";
import "leaflet.pm";
import {
  setSelectedIDs,
  setIfShowMapPoints,
  setSelectedMapIDs,
  setWheelDay,
  SAMPLING_CONDITION,
  setIfShowHeatMap
} from "../actions/setUIState";
import Heading from "./Heading";
import {
  fetchWordCloudDataByIDs,
  getURLBySamplingCondition
} from "../shared/fetch";
import { getArcGenerator, getLineGenerator } from "src/shared/renderer";
import MapControl from "./MapControl";
const mapState = (state: any) => {
  const { mapPoints } = state.dataTree;
  const {
    curTopic,
    selectedIDs,
    systemName,
    ifShowMapPoints,
    samplingFlag,
    wheelDay,
    samplingCondition,
    ifShowHeatMap
  } = state.uiState;
  return {
    mapPoints,
    curTopic,
    selectedIDs,
    systemName,
    ifShowMapPoints,
    samplingFlag,
    wheelDay,
    samplingCondition,
    ifShowHeatMap
  };
};
const mapDispatch = {
  setData,
  setSelectedIDs,
  setIfShowMapPoints,
  setSelectedMapIDs,
  setWheelDay
};

interface Props {
  mapPoints: MapPoints;
  setData: typeof setData;
  curTopic: CurTopic;
  selectedIDs: string[];
  setSelectedIDs: typeof setSelectedIDs;
  systemName: SystemName;
  ifShowMapPoints: boolean;
  setIfShowMapPoints: typeof setIfShowMapPoints;
  setSelectedMapIDs: typeof setSelectedMapIDs;
  samplingFlag: boolean;
  wheelDay: number;
  setWheelDay: typeof setWheelDay;
  samplingCondition: SAMPLING_CONDITION;
  ifShowHeatMap: boolean;
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
    systemName,
    ifShowMapPoints,
    setIfShowMapPoints,
    setSelectedMapIDs,
    samplingFlag,
    wheelDay,
    setWheelDay,
    samplingCondition,
    ifShowHeatMap
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

  const [svgLayer, setSvgLayer] = React.useState<any>(null);

  const [lastTopicPoints, setLastTopicPoints] = React.useState<any>(null);

  const [
    pointsLayerGroup,
    setPointsLayerGroup
  ] = React.useState<null | L.LayerGroup>(null);
  const [heatLayerGroup, setHeatLayerGroup] = React.useState<any>(null);

  const [selectedPointsGroup, setSelectedPointsGroup] = React.useState<any>(
    null
  );
  const [wheelRadius, setWheelRadius] = React.useState<null | number>(null);
  const [wheelCenter, setWheelCenter] = React.useState<any | [number, number]>(
    null
  );

  let dayControler = null;
  function handleShowPointsClick(flag: boolean, e: React.SyntheticEvent) {
    setIfShowMapPoints(flag);
    if (!map || !pointsLayerGroup) return;
    if (flag === true) {
      pointsLayerGroup.addTo(map);
    }
  }

  /*   React.useEffect(() => {
    for (let i = 0; i <= 100; i++) {
      setTimeout(() => {
        setWheelDay(11 + (i % 3));
      }, 5000 + 2000 * i);
    }
  }, []); */
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

  //set map points
  React.useEffect(() => {
    (async function setMapPoints() {
      const newURL = getURLBySamplingCondition(
        url.mapPointsURL,
        samplingCondition
      );
      const res = await fetch(url.mapPointsURL);
      const mapPoints = await res.json();
      setData(MAP_POINTS, mapPoints);
    })();
  }, []);

  React.useEffect(() => {
    (async function setMapPoints() {
      const baseURL = samplingFlag
        ? url.samplingMapPointsURL
        : url.mapPointsURL;
      const newURL = getURLBySamplingCondition(baseURL, samplingCondition);
      const res = await fetch(newURL);
      const mapPoints = await res.json();
      setData(MAP_POINTS, mapPoints);
    })();
  }, [samplingCondition, samplingFlag]);

  //draw selected ids
  React.useEffect(() => {
    if (!map || !mapPoints) return;
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
      if (lastSelectedLayer) {
        map.removeLayer(lastSelectedLayer);
      }
      const layerGroup = L.layerGroup(layers);
      if (ifShowMapPoints) {
        layerGroup.addTo(map);
      }
      setLastSelectedLayer(layerGroup);
    })();
  }, [selectedIDs]);

  React.useEffect(() => {
    if (selectedIDs.length === 0 || !map || !lastSelectedLayer) return;
    if (ifShowMapPoints) {
      lastSelectedLayer.addTo(map);
    } else {
      map.removeLayer(lastSelectedLayer);
    }
  }, [ifShowMapPoints]);

  //click sampling button
  React.useEffect(() => {
    if (!map) return;
  }, [samplingFlag]);

  //add all points to map
  React.useEffect(() => {
    if (!mapPoints || !map) return;
    console.log("mapPoints: ", mapPoints);
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

  //points for one topic
  React.useEffect(() => {
    if (!mapPoints || !curTopic || !map) return;
    if (lastTopicPoints) {
      map.removeLayer(lastTopicPoints);
      controlLayer.removeLayer(lastTopicPoints);
    }
    const allPoints: MapPoint[] = [];

    const pointsSet = new Set();
    mapPoints.map(e => {
      if (e.topic !== curTopic) return;
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
    setLastTopicPoints(layerGroup);
    layerGroup.addTo(map);
    controlLayer.addOverlay(layerGroup, `points for topic${curTopic}`);
  }, [curTopic]);

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

  React.useEffect(() => {
    const map = L.map("map", options);
    L.tileLayer(tileLayerURL).addTo(map);
    setMap(map);
    map.on("click", function(e) {});
    controlLayer.addTo(map);

    map.pm.addControls(options);
    //map.pm.enableDraw("Circle", drawOptions as any);
  }, []);
  React.useEffect(() => {
    if (!map || !svgLayer || !mapPoints) return;
    map.on("pm:create", function(e1: any) {
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
    });
  }, [mapPoints]);

  //create wheel
  React.useEffect(() => {
    if (!map) return;
    let lastW: any = null;
    map.on("pm:create", function(e1: any) {
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

      setWheelRadius(radius);
      setWheelCenter(center);
      (async function drawWheel() {
        const fetch1 = fetch(`./wheelData/${wheelDay}.json`);
        const fetch2 = fetch(`./wheelData/${wheelDay}-meta.json`);
        const res1 = await fetch1;
        const res2 = await fetch2;
        const data: WheelData = await res1.json();
        const meta = await res2.json();
        const { minTime, maxTime, maxValue } = meta;

        const sliceCount = maxTime - minTime;

        const arc = getArcGenerator();

        const cx = e1.layer._point.x;
        const cy = e1.layer._point.y;

        const curWheelCenter = [cx, cy];
        setWheelCenter(curWheelCenter);
        svgLayer.selectAll("path").remove();

        const line = getLineGenerator();

        for (let i = 0; i < data.length; i++) {
          const layerArc = {
            innerRadius: radius + wheelLayerHeight * i,
            outerRadius: radius + wheelLayerHeight * (i + 1),
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
              `translate(${curWheelCenter[0]},${curWheelCenter[1]})`
            );
        }
        const arcDatas = getArcDatasByWheelData(
          data,
          meta,
          radius,
          wheelLayerHeight
        );
        console.log("arcDatas: ", arcDatas);
        for (let arcData of arcDatas) {
          svgLayer
            .append("path")
            .attr("class", "wheel-path")
            .attr("d", arc(arcData))
            .attr("stroke-width", "0.1psx")
            .attr("fill", arcData.color)
            .attr("fill-opacity", arcData.opacity)
            .attr(
              "transform",
              `translate(${curWheelCenter[0]},${curWheelCenter[1]})`
            );
        }
      })();
    });
  }, [mapPoints]);

  //change wheel path
  React.useEffect(() => {
    if (!svgLayer || !wheelRadius || !wheelCenter) return;
    const radius = wheelRadius;
    const center = wheelCenter;
    console.log("wheelDay: ", wheelDay);
    (async function drawWheel() {
      const fetch1 = fetch(`./wheelData/${wheelDay}.json`);
      const fetch2 = fetch(`./wheelData/${wheelDay}-meta.json`);
      const res1 = await fetch1;
      const res2 = await fetch2;
      const data: WheelData = await res1.json();
      const meta = await res2.json();
      const { minTime, maxTime, maxValue } = meta;
      const arc = getArcGenerator();
      const arcDatas = getArcDatasByWheelData(
        data,
        meta,
        radius,
        wheelLayerHeight
      );
      const t = d3
        .transition()
        .duration(200)
        .ease(d3.easeLinear);

      svgLayer
        .selectAll(".wheel-path")
        .data(arcDatas)
        .attr("stroke", function(d: any) {
          return d.color;
        })
        .attr("stroke-width", "0.1psx")
        .attr("fill", function(d: any) {
          return d.color;
        })
        .attr("transform", `translate(${wheelCenter[0]},${wheelCenter[1]})`)
        .transition(t)
        .attr("d", function(d: any) {
          return arc(d);
        });
    })();
  }, [wheelDay]);
  React.useEffect(() => {
    if (!map) return;
    if (systemName === "yelp") {
      map.panTo([40.41433253092038, -79.9775848304853]);
    } else {
      map.panTo([40.74236688190866, -74.01489262003452]);
    }
  }, [systemName]);

  if (wheelCenter) {
    dayControler = (
      <div
        id="day-control-div"
        style={{
          width: 200,
          height: 10,
          backgroundColor: "red",
          position: "absolute",
          top: wheelCenter[1],
          left: wheelCenter[0],
          fill: "red",
          zIndex: 99999
        }}
      />
    );
  }

  let colorBars = [];
  for (let i = 0; i < topicNumber; i++) {
    colorBars.push(
      <div
        key={i}
        style={{
          width: 15,
          height: 15,
          marginTop: 2,
          marginRight: 5,
          borderRadius: "50%",
          backgroundColor: color.nineColors[i],
          float: "right"
        }}
      />
    );
  }
  return (
    <div className="map-view panel panel-default">
      <div className="panel-heading heading map-heading">
        Map View{colorBars}
        <span style={{ float: "right", marginRight: 7 }}>9 topics</span>
      </div>
      <MapControl />
      <div
        id="map"
        className="panel panel-default"
        style={{ textAlign: "left" }}
      />
    </div>
  );
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
