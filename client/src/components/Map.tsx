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
    this.map.on("click", function(e: L.LeafletEvent) {
      console.log(e);
    });
    const controlLayer = L.control
      .layers(undefined, undefined, { collapsed: false })
      .addTo(this.map);
    const p1: [number, number] = [40.910191473681756, -73.79956031218173];
    const p2: [number, number] = [39.796719554947146, -75.38708472624423];

    const bounds = [p1, p2];

    const bound = L.rectangle(bounds);
    controlLayer.addOverlay(bound, "bound");

    fetchAndAddGroupLayer(
      "./truePoints.json",
      "true points",
      L.circle,
      controlLayer,
      {
        color: "blue",
        weight: 1
      }
    );

    fetch("./bounds.json")
      .then(res => res.json())
      .then(data => {
        console.log("grids: ", data);
        const rects: L.Layer[] = [];
        data.map((e: any, i: number) => {
          const rect = L.rectangle(e, { color: "blue", weight: 1 }).on(
            "click",
            function() {
              console.log("e: ", e);
              console.log(e.order);
            }
          );
          rects.push(rect);
        });
        const rectsGroup = L.layerGroup(rects);
        controlLayer.addOverlay(rectsGroup, "grids");
      });

    fetchAndAddGroupLayer(
      "./samplePoints.json",
      "sampling points",
      L.circle,
      controlLayer,
      {
        radius: 5,
        color: "blue"
      }
    );

    fetchAndAddGroupLayer(
      "./overlapPoints.json",
      "overlap points",
      L.circle,
      controlLayer,
      {
        radius: 5,
        color: "blue"
      }
    );

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

    for (let i = 0; i < 10; i++) {
      fetch(`./heatmapData/heat-${i}.json`)
        .then(res => res.json())
        .then(data => {
          var heatmap = new (L as any).WebGLHeatMap({
            size: 500,
            autoresize: true
          });
          heatmap.setData(data);
          controlLayer.addOverlay(heatmap, `heatmap-${i}`);
          /* const heatLayer = (L as any).heatLayer(data, { radius: 15 });
          controlLayer.addOverlay(heatLayer, `heatmap-${i}`); */
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

        /*  const heatLayer = (L as any).heatLayer(data, { radius: 7 });
        controlLayer.addOverlay(heatLayer, `allHeatmap`); */
      }); //#endregion

    fetchAndAddGroupLayer(
      "./allPoints.json",
      "all points",
      L.circle,
      controlLayer,
      {
        radius: 5,
        color: "blue"
      }
    );
  }

  deployMap() {
    const center: [number, number] = [40.75738066643303, -74.0106898997513];
    const zoom = 13.5;
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

[
  "1051986075508514818",
  "bateuuu mais uma meta concluida com sucesso pera o gui @Joaoguiavila #MPN #JoaoGuilherme #JadePicon",
  "1539648000000",
  "0",
  "",
  "",
  "false",
  "city",
  "5722ff20ba67083b",
  "Brasília, Brasil",
  "BR",
  "Brasil",
  "Polygon",
  "-48.285982",
  "-16.052405",
  "-48.285982",
  "-15.500103",
  "-47.307264",
  "-15.500103",
  "-47.307264",
  "-16.052405",
  "",
  "1051892738382286850",
  "896543109483462656",
  "larissaevlly",
  "pt",
  "896543109483462656",
  "Larissa Ferreira 🅾️ ➕",
  "larissaevlly",
  "56128",
  "1502587509000",
  "Feito pra votar no João Guilherme 💖",
  "Brasília, Brasil",
  "156",
  "126",
  "",
  "-1\n"
];

[
  "1052348463650938881",
  "@mrboboto @cejarvis @ambivalentricky Between @tubafrenzy at the office and Nate & Caryn randomly at Parker & Otis i… https://t.co/jSAYmeJUMR",
  "1539734400000",
  "0",
  "",
  "",
  "false",
  "city",
  "bced47a0c99c71d0",
  "Durham, NC",
  "US",
  "United States",
  "Polygon",
  "-79.007589",
  "35.866334",
  "-79.007589",
  "36.115631",
  "-78.783292",
  "36.115631",
  "-78.783292",
  "35.866334",
  "",
  "1052336238164959233",
  "17869879",
  "mrboboto",
  "en",
  "16467600",
  "Ross Grady",
  "rossgrady",
  "99285",
  "1222436065000",
  "Fairly googleable. Username rossgrady on most social networks. Art, music, food, feminism, social justice, not necessarily in that order. [pic by Lissa Gotwals]",
  "Durham, NC",
  "2391",
  "887",
  "",
  "-1\n"
];

[
  "1051623688267882496",
  "jenau vor eenem jahr war ooch zweie! bäm bäm",
  "1539561600000",
  "0",
  "13.435",
  "52.481388",
  "true",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "de",
  "1092190045",
  "Rathausuhr Neukölln",
  "rh_neukoelln",
  "50275",
  "1358258769000",
  "",
  "",
  "1511",
  "24",
  "",
  "-1\n"
];

[
  "1051261299777331205",
  "突発弾丸日帰り旅行！ (@ 山谷PA (上り) - @driveplaza in 小千谷市, 新潟県) https://t.co/bXtGb2gQk5",
  "1539475200000",
  "0",
  "138.78283269",
  "37.32563245",
  "true",
  "city",
  "ea7280e3221e6c47",
  "新潟 小千谷市",
  "JP",
  "日本",
  "Polygon",
  "138.720393",
  "37.2059",
  "138.720393",
  "37.385103",
  "138.914937",
  "37.385103",
  "138.914937",
  "37.2059",
  "",
  "",
  "",
  "",
  "ja",
  "122143646",
  "りゅん",
  "ryun2151",
  "54829",
  "1268333573000",
  "気持ちで負けてます。",
  "おこめとらーめんオイシイヨ",
  "286",
  "631",
  "",
  "-1\n"
];
