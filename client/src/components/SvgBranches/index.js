import React, { Component } from "react";

import GIContainer from "../containers/GIContainer";
import "./style.css";

const SVG_PADDING = 10;

class SvgBranch extends Component {
  getSvgBranches = numberOfBranches => {
    const increment = 80 / numberOfBranches;
    const svgBranches = [];

    for (let i = 0; i < numberOfBranches; i++) {
      let y = (i + 0.5) * increment + SVG_PADDING;
      if (i === 0) y = increment / 2 + SVG_PADDING;
      svgBranches.push(
        <g key={i}>
          <path
            className="branch"
            d={`M ${SVG_PADDING},${y} L ${100 - SVG_PADDING},${y}`}
          />
          <circle cx={100 - SVG_PADDING} cy={y} className="branch-point" />
        </g>
      );
    }
    return svgBranches;
  };
  render() {
    const { numberOfBranches } = this.props;

    return (
      <svg viewBox="0 0 100 100">
        <circle
          cx={SVG_PADDING}
          cy={SVG_PADDING}
          className="branch-point large"
        />

        <path
          d={`M ${SVG_PADDING},${SVG_PADDING} L ${SVG_PADDING}, ${100 -
            SVG_PADDING}`}
          className="branch"
        />

        {this.getSvgBranches(numberOfBranches)}

        <circle
          cx={SVG_PADDING}
          cy={`${100 - SVG_PADDING}`}
          className="branch-point large"
        />
      </svg>
    );
  }
}

export default SvgBranch;
