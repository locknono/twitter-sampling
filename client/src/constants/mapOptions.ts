export const tl: [number, number] = [40.9328129198744, -74.32278448250146];
export const rb: [number, number] = [40.49040846908216, -73.73446653597058];
const center: [number, number] = [40.74236688190866, -74.01489262003452];
const zoom = 11.5;
const preferCanvas = true;
const zoomControl = false;
const attributionControl = false;
const zoomDelta = 0.1;
const zoomSnap = 0.1;
export const tileLayerURL =
  "https://api.mapbox.com/styles/v1/lockyes/cjiva3omz8hrq2so4mfdaurmw/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9ja3llcyIsImEiOiJjamlvaDExMW8wMDQ2M3BwZm03cTViaWwwIn0.AWuS0iLz_Kbk8IOrnm6EUg";

export const options: object = {
  center,
  zoom,
  zoomControl,
  attributionControl,
  preferCanvas,
  zoomDelta,
  zoomSnap
};
export const pmOptions = {
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
export const drawOptions = {
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
