type ScatterData = [number, number][][];

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
