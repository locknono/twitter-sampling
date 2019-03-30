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
  wheelLayerHeight,
  defaultMinWheelInter,
  defaultMinWheelValue
} from "../constants/constants";
import { tl, rb, options, tileLayerURL } from "src/constants/mapOptions";
import {
  setData,
  MAP_POINTS,
  CLOUD_DATA,
  SCATTER_DATA,
  RIVER_DATA,
  SAMPLING_RIVER_DATA,
  WHEEL_DATA,
  SET_MAP_POINTS
} from "../actions/setDataAction";
import { connect, ReactReduxContext } from "react-redux";
import "leaflet.pm";
import {
  setSelectedIDs,
  setIfShowMapPoints,
  setSelectedMapIDs,
  setWheelDay,
  SAMPLING_CONDITION,
  setIfShowHeatMap,
  setHoverID
} from "../actions/setUIState";
import Heading from "./Heading";
import {
  fetchWordCloudDataByIDs,
  getURLBySamplingCondition
} from "../shared/fetch";
import { getArcGenerator, getLineGenerator } from "src/shared/renderer";
import MapControl from "./MapControl";
import {
  usePointsOnMap,
  useHeat,
  useSvgLayer,
  useMap,
  useSelectedPoints,
  useTopicPoints
} from "src/hooks/mapHooks";
const mapState = (state: any) => {
  const { mapPoints, wheelData } = state.dataTree;
  const {
    curTopic,
    selectedIDs,
    systemName,
    ifShowMapPoints,
    samplingFlag,
    wheelDay,
    samplingCondition,
    ifShowHeatMap,
    hoverID
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
    ifShowHeatMap,
    wheelData,
    hoverID
  };
};
const mapDispatch = {
  setData,
  setSelectedIDs,
  setIfShowMapPoints,
  setSelectedMapIDs,
  setWheelDay,
  setHoverID
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
  wheelData: WheelData | null;
  setHoverID: typeof setHoverID;
  hoverID: string | null;
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
    ifShowHeatMap,
    wheelData,
    hoverID,
    setHoverID
  } = props;

  const initialControlLayer = L.control.layers(undefined, undefined, {
    collapsed: false
  });

  const [controlLayer, setControlLayer] = React.useState<L.Control.Layers>(
    initialControlLayer
  );

  const [wheelRadius, setWheelRadius] = React.useState<null | number>(null);
  const [wheelCenter, setWheelCenter] = React.useState<any | [number, number]>(
    null
  );

  const map = useMap();

  usePointsOnMap(
    mapPoints,
    map,
    ifShowMapPoints,
    selectedIDs,
    curTopic,
    setHoverID
  );
  useHeat(map, ifShowHeatMap, samplingFlag, samplingCondition);
  const svgLayer = useSvgLayer(map);
  const lastSelectedLayer = useSelectedPoints(
    map,
    mapPoints,
    selectedIDs,
    ifShowMapPoints,
    setHoverID
  );
  useTopicPoints(
    map,
    mapPoints,
    selectedIDs,
    ifShowMapPoints,
    curTopic,
    setHoverID
  );
  //set map points data
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
      location.href = "localhost:8000";
    })();
  }, [samplingCondition, samplingFlag]);

  React.useEffect(() => {
    if (selectedIDs.length === 0 || !map || !lastSelectedLayer) return;
    if (ifShowMapPoints) {
      lastSelectedLayer.addTo(map);
    } else {
      map.removeLayer(lastSelectedLayer);
    }
  }, [ifShowMapPoints]);

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
      const ids: string[] = [];
      mapPoints.map(e => {
        if (ifInside([e.lat, e.lng], center, radius, map)) {
          ids.push(e.id);
        }
      });
      setSelectedIDs(ids);
      setWheelRadius(radius);
      setWheelCenter(center);
      (async function drawWheel() {
        const postData = {
          selectedIDs: ids,
          minValue: defaultMinWheelValue,
          minInter: defaultMinWheelInter
        };

        const res = await fetch(pythonServerURL + "getWheelDataByIDs", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          body: JSON.stringify(postData)
        });
        const wheelData = await res.json();
        setData(WHEEL_DATA, wheelData);
        const { metas, wheelDatas, startDay } = wheelData;
        const [meta, data] = [
          metas[wheelDay - startDay],
          wheelDatas[wheelDay - startDay]
        ];

        const { minTime, maxTime, maxValue } = meta;

        const sliceCount = maxTime - minTime;

        const arc = getArcGenerator();

        const cx = e1.layer._point.x;
        const cy = e1.layer._point.y;

        const curWheelCenter = [cx, cy];
        setWheelCenter(curWheelCenter);
        svgLayer.selectAll("path").remove();

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
            .attr("opacity", 0.3)
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

        for (let arcData of arcDatas) {
          svgLayer
            .append("path")
            .attr("class", "wheel-path")
            .attr("d", arc(arcData))
            .attr("stroke-width", "0.5psx")
            .attr("fill", arcData.color)
            .attr("stroke", arcData.color)
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
    if (!svgLayer || !wheelRadius || !wheelCenter || !wheelData) return;
    const radius = wheelRadius;
    (async function drawWheel() {
      const { metas, wheelDatas, startDay } = wheelData;
      const [meta, data] = [
        metas[wheelDay - startDay],
        wheelDatas[wheelDay - startDay]
      ];
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
      svgLayer.selectAll(".wheel-path").remove();
      svgLayer
        .selectAll(".wheel-path")
        .data(arcDatas)
        .enter()
        .append("path")
        .attr("class", "wheel-path")
        .attr("stroke", (d: any) => d.color)
        .attr("fill", (d: any) => d.color)
        .attr("stroke-width", "0.5psx")
        .attr("transform", `translate(${wheelCenter[0]},${wheelCenter[1]})`)
        .attr("d", function(d: any) {
          return arc(d);
        });
    })();
  }, [wheelDay, wheelData]);

  React.useEffect(() => {
    if (!map) return;
    if (systemName === "yelp") {
      map.panTo([40.41433253092038, -79.9775848304853]);
    } else {
      map.panTo([40.74236688190866, -74.01489262003452]);
    }
  }, [systemName]);

  let colorBars = [];
  for (let i = topicNumber - 1; i >= 0; i--) {
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
          float: "right",
          transform: curTopic === i ? "scale(1.16)" : "scale(1)",
          transformOrigin: "center"
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
