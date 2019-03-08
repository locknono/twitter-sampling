import * as React from "react";
import * as L from "leaflet";
import * as d3 from "d3";
//import "leaflet.heat";
import "leaflet-webgl-heatmap";
import { fetchAndAddGroupLayer } from "../API/mapAPI";
import { colorScale } from "../constants";
interface Props {}

interface Map {
  mapRef: any;
  map: L.Map;
}
class Map extends React.Component<Props, Object> {
  constructor(props: Props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    this.deployMap();
    this.map.on("click", function(e: L.LeafletEvent) {});
    const controlLayer = L.control
      .layers(undefined, undefined, { collapsed: false })
      .addTo(this.map);
    const p1: [number, number] = [40.910191473681756, -73.79956031218173];
    const p2: [number, number] = [39.796719554947146, -75.38708472624423];

    const bounds = [p1, p2];

    const bound = L.rectangle(bounds);
    controlLayer.addOverlay(bound, "bound");

    /* fetchAndAddGroupLayer(
      "./truePoints.json",
      "true points",
      L.circle,
      controlLayer,
      {
        color: "blue",
        weight: 1
      }
    ); */

    /* fetch("./grids.json")
      .then(res => res.json())
      .then(data => {
        const rects: L.Layer[] = [];
        data.map((e: any, i: number) => {
          const rect = L.rectangle(e, { color: "blue", weight: 1 }).on(
            "click",
            function() {
              
              
            }
          );
          rects.push(rect);
        });
        const rectsGroup = L.layerGroup(rects);
        controlLayer.addOverlay(rectsGroup, "grids");
      }); */

    fetchAndAddGroupLayer(
      "./sampling-2209-0.9090909090909091.json",
      "sampling points",
      L.circle,
      controlLayer,
      {
        radius: 5,
        color: "blue"
      }
    );

    /* fetchAndAddGroupLayer(
      "./overlapPoints.json",
      "overlap points",
      L.circle,
      controlLayer,
      {
        radius: 5,
        color: "blue"
      }
    ); */

    fetch("./samplePoints.json")
      .then(res => res.json())
      .then(data => {
        const points: L.Circle[] = data.map((e: any) =>
          L.circle([e.lat, e.lng], { radius: e.r, color: "blue" })
        );
        const layerGroup = L.layerGroup(points);
        controlLayer.addOverlay(layerGroup, "disks");
      });
    fetch("./samplePoints.json")
      .then(res => res.json())
      .then(data => {
        const points: L.Circle[] = [];
        data.map((e: any, index: number) => {
          e.pointsInDisk.map((v: any) => {
            const c = L.circle([v.lat, v.lng], {
              radius: 5,
              color: colorScale(index.toString())
            });
            points.push(c);
          });
        });
        const layerGroup = L.layerGroup(points);
        controlLayer.addOverlay(layerGroup, "points in disks");
      });

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
    }

    fetch(`./allHeatmap.json`)
      .then(res => res.json())
      .then(data => {
        var heatmap = new (L as any).WebGLHeatMap({
          size: 1000,
          autoresize: true
        });
        heatmap.setData(data);
        controlLayer.addOverlay(heatmap, `allHeatmap`);
        //const heatLayer = (L as any).heatLayer(data, { radius: 7 });
        //controlLayer.addOverlay(heatLayer, `allHeatmap`);
      }); //#endregion */

    fetchAndAddGroupLayer(
      "./allPoints.json",
      "all points",
      L.circle,
      controlLayer,
      {
        radius: 5,
        color: "blue"
      }
    ).then(layerGroup => {
      layerGroup.addTo(this.map);
    });
  }

  deployMap() {
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
    this.map = L.map(this.mapRef.current.id, options);
    L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).addTo(
      this.map
    );
  }

  render() {
    return <div id="map" ref={this.mapRef} className="panel panel-default" />;
  }
}

export default Map;
