type ScatterData = [number, number][][];

interface ScatterPoint {
  id: string;
  x: number;
  y: number;
  topic: number;
}

type ScatterPoints = ScatterPoint[];
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
