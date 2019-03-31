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
import { SAMPLING_CONDITION } from "src/actions/setUIState";
import { getURLBySamplingCondition } from "src/shared/fetch";

const mapState = (state: any) => {
  const { riverData } = state.dataTree;
  const { curTopic, samplingFlag, samplingCondition } = state.uiState;
  return { riverData, curTopic, samplingFlag, samplingCondition };
};
const mapDispatch = {
  setData
};

interface Props {
  riverData: [string, number, string][];
  curTopic: CurTopic;
  setData: typeof setData;
  samplingFlag: boolean;
  samplingCondition: SAMPLING_CONDITION;
}
function River(props: Props) {
  const {
    riverData,
    curTopic,
    setData,
    samplingFlag,
    samplingCondition
  } = props;
  const [myChart, setMyChart] = React.useState<any>(null);
  React.useEffect(() => {
    const fetchURL =
      samplingFlag === true
        ? getURLBySamplingCondition(url.samplingRiverDataURL, samplingCondition)
        : url.riverDataURL;
    fetchJsonData(fetchURL).then(data => {
      setData(RIVER_DATA, data);
    });
  }, [samplingFlag, samplingCondition]);

  React.useEffect(() => {
    if (!riverData) return;
    const option = createRiverOption(riverData);
    myChart.setOption(option as any);
  }, [riverData]);

  React.useEffect(() => {
    const myChart = echarts.init(document.getElementById(
      "river"
    ) as HTMLDivElement);
    setMyChart(myChart);
  }, []);

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
