import * as React from "react";
import "./App.css";
import BarChart from "./components/BarChart";
import Map from "./components/Map";
import HookTest from "./components/HookTest";
import DataDescription from "./components/DataDescription";
class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Map />
        <DataDescription />
        <HookTest />
      </div>
    );
  }
}

export default App;
