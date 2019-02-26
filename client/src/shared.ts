export function getMinMax(list: number[]) {
  return [Math.min(...list), Math.max(...list)];
}

export function getSvgRenderWidthHeight(
  width: number,
  height: number,
  pad: number
) {
  return [width * (1 - pad), height * (1 - pad)];
}
