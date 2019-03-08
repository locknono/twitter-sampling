import * as React from "react";
import * as d3 from "d3";

export function useWidthAndHeight(domID: string) {
  const [width, setWidth] = React.useState<number | undefined>(undefined);
  const [height, setHeight] = React.useState<number | undefined>(undefined);
  React.useLayoutEffect(() => {
    const w = parseFloat(d3.select(`#${domID}`).style("width"));
    const h = parseFloat(d3.select(`#${domID}`).style("height"));
    setWidth(w);
    setHeight(h);
  }, []);
  return [width, height];
}
