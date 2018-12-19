import React, { Component } from "react";
import moment from "moment-timezone";

import LineChart from "../../../components/LineChart";

class Section4 extends Component {
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
      <div className="section px32 my64 py64">
        <div className="flex1 common-container-center mb32">
          <div className="small-box">
            <h4 className="h1-like pt8">Social Scheduling</h4>
            <p>
              Sync all your social sharing accounts and post directly from our
              platform.
            </p>
          </div>
        </div>
        <div id="home-page-chart-container" className="flex1">
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
      </div>
    );
  }
}

export default Section4;
