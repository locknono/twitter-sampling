import * as d3 from "d3";

export function getArcGenerator() {
  const arc = d3
    .arc()
    .innerRadius(function(d) {
      return d.innerRadius;
    })
    .outerRadius(function(d) {
      return d.outerRadius;
    })
    .startAngle(function(d) {
      return d.startAngle;
    })
    .endAngle(function(d) {
      return d.endAngle;
    });
  return arc;
}

export function getLineGenerator() {
  const line = d3
    .line()
    .x(d => d[0])
    .y(d => d[1]);
  return line;
}
