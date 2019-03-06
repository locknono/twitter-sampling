import * as React from "react";
import "./App.css";
import Map from "./components/Map";
import DataDescription from "./components/DataDescription";
import ControlPanel from "./components/ControlPanel";
import Heading from "./components/Heading";
import Scatter from "./components/Scatter";
import WordCloud from "./components/WordCloud";
import River from "./components/River";
import BarChart from "./components/BarChart";

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
            <Scatter />
          </div>
          <div className="barchart-div">
            <Heading title="LDA" />
            <BarChart />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
