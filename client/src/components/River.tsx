import * as React from "react";
import { useState } from "react";

import * as echarts from "echarts";
import Heading from "./Heading";
import { setData, RIVER_DATA } from "../actions/setDataAction";
import { connect } from "react-redux";
import { fetchJsonData } from "src/shared";
import { topicNumber, url } from "src/constants/constants";
import { color } from "../constants/constants";
import { createRiverOption } from "src/constants/riverOptions";

const mapState = (state: any) => {
  const { riverData } = state.dataTree;
  const { curTopic, samplingFlag } = state.uiState;
  return { riverData, curTopic, samplingFlag };
};
const mapDispatch = {
  setData
};

interface Props {
  riverData: [string, number, string][];
  curTopic: CurTopic;
  setData: typeof setData;
  samplingFlag: boolean;
}
function River(props: Props) {
  const { riverData, curTopic, setData, samplingFlag } = props;

  React.useEffect(() => {
    const fetchURL =
      samplingFlag === true ? url.samplingRiverDataURL : url.riverDataURL;
    fetchJsonData(fetchURL).then(data => {
      setData(RIVER_DATA, data);
    });
  }, [samplingFlag]);

  React.useEffect(() => {
    if (!riverData) return;
    const myChart = echarts.init(document.getElementById(
      "river"
    ) as HTMLDivElement);
    const option = createRiverOption(riverData);
    myChart.on("click", function() {});
    myChart.setOption(option as any);
  }, [riverData]);

  return (
    <div className="river-view panel panel-default">
      <Heading title="Topic River" />
      <div id="river" />
    </div>
  );
}

export default connect(
  mapState,
  mapDispatch
)(River);
