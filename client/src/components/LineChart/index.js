import React, { Component } from "react";

import "./styles/";

class LineChart extends Component {
  createVerticalLines = lines => {
    return lines.map((line, lineIndex) => {
      let x = ~~(((lineIndex + 1) / lines.length) * 100);

      return (
        <path
          className="test2"
          d={"M" + x + ",0 L " + x + ",100"}
          key={x + "line"}
        />
      );
    });
  };
  render() {
    let { lines } = this.props;

    return (
      <svg className="test" viewBox="0 0 100 100" preserveAspectRatio="none">
        {this.createVerticalLines(lines)}
      </svg>
    );
  }
}

export default LineChart;
