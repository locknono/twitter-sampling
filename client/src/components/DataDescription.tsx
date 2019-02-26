import * as React from "react";
import { useState } from "react";

export default function DataDescription() {
  const [allTweetsCount, setAllTweetsCount] = useState(0);
  return (
    <div>
      <p>all tweets: {allTweetsCount} </p>
    </div>
  );
}
