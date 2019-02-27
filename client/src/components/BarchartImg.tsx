import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";

export default function BarchartImg() {
  return (
    <React.Fragment>
      <img
        src="./barchart/original.png"
        style={{ width: "100%", height: "50%" }}
      />
      <img
        src="./barchart/afterSampling.png"
        style={{ width: "100%", height: "50%" }}
      />
      <img
        src="./barchart/21.426455863299978.png"
        style={{ width: "100%", height: "100%" }}
      />
    </React.Fragment>
  );
}
