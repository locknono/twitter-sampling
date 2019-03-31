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
} from "../constants/constants";
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
  id: string;
  time: string;
  background?: string;
}
export default function SingleText(props: Props) {
  const { text, index, id, time, background } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderBottom: "solid 1px rgb(222,222,222)",
        background: background
      }}
    >
      <div style={{ display: "flex" }}>
        <div
          style={{
            flex: "0 1 auto",
            display: "flex",
            alignItems: "center"
          }}
        >
          <img
            src={`./imgs/0 (${index + 1}).jpg`}
            style={{
              width: 50,
              height: 50,
              margin: "auto",
              borderRadius: "50%"
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flex: "1 0 auto",
            flexDirection: "column",
            justifyContent: "space-around"
          }}
        >
          <div
            style={{
              fontWeight: "bold"
            }}
          >
            {id}
          </div>
          <div>{time}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start"
        }}
      >
        <div>{text}</div>
      </div>
    </div>
  );
}
