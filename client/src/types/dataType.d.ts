interface ScatterData {
  [id: string]: [number, number];
}

interface DocPrData {
  [id: string]: number[];
}

type CurTopic = number | undefined;

interface CloudWord {
  text: string;
  size: number;
}

type CloudData = CloudWord[][];
