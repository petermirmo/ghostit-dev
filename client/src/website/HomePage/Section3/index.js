import React, { Component } from "react";
import moment from "moment-timezone";

import LineChart from "../../../components/LineChart";

class Section3 extends Component {
  state = {
    lines: [[]]
  };
  componentDidMount() {
    this._ismounted = true;
    this.createRandomChartPlots();
    this.interval = setInterval(this.createRandomChartPlots, 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  createRandomChartPlots = () => {
    let amountOfLines = 3;
    let amountOfDataPoints = 10;
    let lines = [];
    for (let i = 0; i < amountOfLines; i++) {
      lines[i] = [];
    }

    for (let i = 0; i < amountOfLines; i++) {
      for (let j = 0; j < amountOfDataPoints; j++) {
        lines[i].push(j + ~~(Math.random() * 20));
      }
    }
    this.setState({ lines });

    //212 712
  };
  render() {
    const { lines } = this.state;

    return (
      <div className="section flex hc vc px32">
        <div className="platform-component-showcase fill">
          <LineChart
            {...{
              lines: lines,
              colors: [
                "var(--five-purple-color)",
                "var(--five-primary-color)",
                "var(--seven-purple-color)",
                "var(--seven-primary-color)"
              ]
            }}
          />
        </div>
        <div className="third flex column vc hc">
          <div className="description-box flex column hc">
            <h4 className="title silly-font pb8">Post Instructions.</h4>
            <p className="body">
              Add custom steps for your marketing campaign or follow existing
              ones with a pre-built template.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Section3;
