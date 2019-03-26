import * as React from "react";
import * as d3 from "d3";
import { setData, SCATTER_DATA, CLOUD_DATA } from "../actions/setDataAction";
import { setIfDrawCenters, setSelectedIDs } from "../actions/setUIState";
import {
  color,
  padding,
  scatterRadius,
  topicNumber,
  pythonServerURL,
  url
} from "../constants";
import { connect } from "react-redux";
import { useWidthAndHeight } from "src/hooks/layoutHooks";
import { useCtxWithRef } from "src/hooks/canvasHooks";
import { updateQueue } from "../fiber/updateQueue";
import createFiber from "../fiber/fiber";
import * as v4 from "uuid/v4";
import Heading from "../components/Heading";

interface Props {
  text: string;
  index: number;
}
export default function SingleText(props: Props) {
  const { text, index } = props;

  const imgRadius = 65;
  return (
    <div style={{ width: "100%", height: imgRadius, display: "flex" }}>
      <div
        style={{
          marginLeft: "5px",
          width: imgRadius,
          height: imgRadius
        }}
      >
        <img
          src={`./imgs/${index % 6}.jpg`}
          style={{
            width: `100%`,
            height: `100%`,
            borderRadius: `50%`,
            border: "solid 1px rgb(222,222,222)",
            transform: "scale(0.8)",
            transformOrigin: "center"
          }}
        />
      </div>
      <div
        style={{
          display: "block",
          float: "left",
          width: "100%"
        }}
      >
        <a href="#" className="list-group-item">
          {text}
        </a>
      </div>
    </div>
  );
}
