import * as React from "react";
import "./css/App.css";
import Map from "./components/Map";
import DataDescription from "./components/DataDescription";
import ControlPanel from "./components/ControlPanel";
import Heading from "./components/Heading";
import Scatter from "./components/Scatter";
import WordCloud from "./components/WordCloud";
import River from "./components/River";
import BarChart from "./components/BarChart";
import Matrix from "./components/Matrix";
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
          <div className="scatter-div panel panel-default">
            <Heading title="Projection View" />
            <Scatter />
          </div>

          <div className="barchart-div panel panel-default">
            <Heading title="LDA" />
            <Matrix />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
