import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";
import * as d3 from "d3";
import * as cloud from "d3-cloud";

declare module "d3" {
  namespace layout {
    interface Cloud<T extends cloud.Word> {
      random(): Cloud<T>;
      random(randomFunction: () => number): Cloud<T>;

      canvas(): Cloud<T>;
      canvas(canvasGenerator: () => HTMLCanvasElement): Cloud<T>;
    }
  }
}
export default function WordCloud() {
  /* const [width, setWidth] = React.useState<number | undefined>(undefined);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  React.useLayoutEffect(() => {
    const w = parseFloat(d3.select("#cloud-svg").style("width"));
    const h = parseFloat(d3.select("#cloud-svg").style("height"));
    setWidth(w);
    setHeight(h);
  });

  React.useEffect(() => {
    if (!width || !height) return;
    const c = cloud();
    const texts = [
      "Hello",
      "world",
      "normally",
      "you",
      "want",
      "more",
      "words",
      "than",
      "this"
    ];
    c.size([width, height])
      .words(
        texts.map(d => {
          return { text: d, size: 10 + Math.random() * 90 };
        })
      )
      .padding(5)
      .rotate(function() {
        return ~~(Math.random() * 2) * 90;
      })
      .font("Impact")
      .fontSize(function(d) {
        return d.size as number;
      })
      .on("end", draw);
    c.start();

    function draw(
      words: {
        size: number;
        text: string;
        x: number;
        y: number;
        rotate: number;
      }[]
    ) {
      d3.select("#cloud-svg")
        .append("g")
        .attr(
          "transform",
          "translate(" + c.size()[0] / 2 + "," + c.size()[1] / 2 + ")"
        )
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", function(d) {
          return d.size + "px";
        })
        .style("font-family", "Impact")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) {
          return d.text;
        });
    }
  }); */
  return (
    /*  <div className="word-cloud-div panel panel-default">
      <svg id="cloud-svg" />
    </div> */
    <div className="word-cloud-div panel panel-default">
      <img
        src="./wordCloud/s1.png"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
