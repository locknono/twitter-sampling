type ScatterData = [number, number][][];

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  topic: number;
}

interface ScatterPoint {
  id: string;
  x: number;
  y: number;
  topic: number;
}

type ScatterPoints = ScatterPoint[];
type MapPoints = MapPoint[];
interface DocPrData {
  [id: string]: number[];
}

type CurTopic = number | undefined;

interface CloudWord {
  text: string;
  fre: number;
  size?: number;
}

type CloudData = CloudWord[][];

type SystemName = "yelp" | "twitter";
