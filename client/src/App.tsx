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
          <Heading title="LDA" />
          <Matrix />
        </div>
        <div className="whole-right">
          <div className="above-div panel panel-default">
            <Map />
            <div className="right-side panel panel-default">
              <div className="barchart-div panel panel-default">
                <WordCloud />
              </div>
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
