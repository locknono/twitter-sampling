import * as React from "react";
import { useState } from "react";
import Heading from "../components/Heading";
import { connect } from "react-redux";
interface Props {
  count: number | undefined;
  samplingFlag: boolean;
}
const mapState = (state: any) => {
  const { scatterData } = state.dataTree;
  const { samplingFlag } = state.uiState;
  if (!scatterData) return {};
  return { count: scatterData ? scatterData.length : undefined, samplingFlag };
};
const mapDispatch = {};

function DataDescription(props: Props) {
  const { count, samplingFlag } = props;
  const [allTweetsCount, setAllTweetsCount] = useState<undefined | number>(
    undefined
  );
  const [samplingTweetsCount, setSamplingTweetsCount] = useState<
    undefined | number
  >(undefined);

  React.useEffect(() => {
    if (!count) return;
    if (samplingFlag === false && count !== allTweetsCount) {
      setAllTweetsCount(count);
    } else if (samplingFlag === true && count !== samplingTweetsCount) {
      setSamplingTweetsCount(count);
    }
  }, [count]);

  let allTweetsCountDOM = allTweetsCount ? (
    <p>original data: {allTweetsCount} </p>
  ) : (
    <p>original data: </p>
  );

  let samplingCountDOM = samplingTweetsCount ? (
    <p>sampled data: {samplingTweetsCount} </p>
  ) : (
    <p>sampled data:</p>
  );
  return (
    <div className="panel panel-default data-description-div ">
      <Heading title="Social Media Data" />
      <div className="data-description-content-div">
        <div className="buttons-div " id="buttons-div1">
          <button id="dataset" className="btn btn-default btn-sm white-button">
            dataset
          </button>
          <input type="text" />
        </div>
        {allTweetsCountDOM}
        {samplingCountDOM}
      </div>
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(DataDescription);
