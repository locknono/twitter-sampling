import * as React from "react";

class BarChart extends React.Component {
  componentDidMount() {
    fetch("/test")
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  }
  render() {
    return <div />;
  }
}

export default BarChart;
