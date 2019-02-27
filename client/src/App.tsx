import * as React from "react";
import "./App.css";
import Map from "./components/Map";
import HookTest from "./components/HookTest";
import DataDescription from "./components/DataDescription";
import BarChart from "./components/BarChart";
import ControlPanel from "./components/ControlPanel";
import Heading from "./components/Heading";
import Scatter from "./components/Scatter";
class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div className="left-side panel panel-default">
          <DataDescription />
          <ControlPanel />
        </div>
        <div className="middle panel panel-default">
          <Map />
          <HookTest />
        </div>
        <div className="right-side panel panel-default">
          <div className="scatter-div">
            <Heading title="LDA Scatter" />
            <Scatter />
          </div>

          <div className="barchart-div">
            <Heading title="LDA" />
            <BarChart values={[5, 1, 2, 6, 5, 5, 9]} width={300} height={300} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
