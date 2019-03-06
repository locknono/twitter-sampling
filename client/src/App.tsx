import * as React from "react";
import "./App.css";
import Map from "./components/Map";
import DataDescription from "./components/DataDescription";
import ControlPanel from "./components/ControlPanel";
import Heading from "./components/Heading";
import LdaScatterCanvas from "./components/LdaScatterCanvas";
import WordCloud from "./components/WordCloud";
import River from "./components/River";
import LdaBarChart from "./components/LdaBarChart";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div className="left-side panel panel-default">
          <DataDescription />
          <ControlPanel />
          <WordCloud />
        </div>
        <div className="middle panel panel-default">
          <Map />
          <River />
        </div>
        <div className="right-side panel panel-default">
          <div className="scatter-div">
            <Heading title="LDA Scatter" />
            {/* <Scatter /> */}
            <LdaScatterCanvas />
          </div>

          <div className="barchart-div">
            <Heading title="LDA" />
            <LdaBarChart />
            {/* <BarchartImg /> */}
            {/* <BarChart values={[5, 1, 2, 6, 5, 5, 9]} width={300} height={300} /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
