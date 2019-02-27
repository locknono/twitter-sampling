import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";

export default function DataDescription() {
  const [allTweetsCount, setAllTweetsCount] = useState(0);
  return (
    <div className="panel panel-default data-description-div ">
      <Heading title="Data" />
      <p>all tweets: {allTweetsCount} </p>
    </div>
  );
}
