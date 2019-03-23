import * as React from "react";
import "./css/App.css";
import "./css/componentStyle.css";
import Map from "./components/Map";
import DataDescription from "./components/DataDescription";
import ControlPanel from "./components/ControlPanel";
import Heading from "./components/Heading";
import Scatter from "./components/Scatter";
import WordCloud from "./components/WordCloud";
import River from "./components/River";
import BarChart from "./components/BarChart";
import Matrix from "./components/Matrix";
import GroupBar from "./components/GroupBar";
import Texts from "./components/Texts"

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div className="left-side panel panel-default">
          <DataDescription />
          <ControlPanel />
          <GroupBar />
          <Matrix />
        </div>
        <div className="whole-right">
          <div className="above-div panel panel-default">
            <Map />
            <div className="right-side panel panel-default">
              <WordCloud />
              <Texts></Texts>
            </div>
          </div>

          <div className="bottom-div">
            <Scatter />
            <River />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
