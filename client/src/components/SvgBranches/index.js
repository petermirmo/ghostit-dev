import React, { Component } from "react";
import { SizeMe } from "react-sizeme";

import GIContainer from "../containers/GIContainer";
import "./style.css";

class SvgBranches extends Component {
  getSvgBranches = (numberOfBranches, svgPadding, svgX, svgY) => {
    const increment = (svgY - 2 * svgPadding) / numberOfBranches;
    const svgBranches = [];

    for (let i = 0; i < numberOfBranches; i++) {
      let y = (i + 0.5) * increment + svgPadding;
      if (i === 0) y = increment / 2 + svgPadding;
      svgBranches.push(
        <g key={i}>
          <path
            className="branch"
            d={`M ${svgPadding},${y} L ${svgX - svgPadding},${y}`}
          />
          <circle cx={svgPadding} cy={y} className="branch-point" />

          <circle cx={svgX - svgPadding} cy={y} className="branch-point" />
        </g>
      );
    }
    return svgBranches;
  };
  render() {
    const { numberOfBranches } = this.props;
    return (
      <SizeMe monitorHeight>
        {({ size }) => {
          const svgX = size.width;
          const svgY = size.height;
          console.log(size);
          const svgPadding = 0.2 * svgX;
          return (
            <svg viewBox={`0 0 ${svgX} ${svgY}`} className="fill-parent">
              <circle
                cx={svgPadding}
                cy={svgPadding}
                className="branch-point large"
              />

              <path
                d={`M ${svgPadding},${svgPadding} L ${svgPadding}, ${svgY -
                  svgPadding}`}
                className="branch"
              />

              {this.getSvgBranches(numberOfBranches, svgPadding, svgX, svgY)}

              <circle
                cx={svgPadding}
                cy={`${svgY - svgPadding}`}
                className="branch-point large"
              />
            </svg>
          );
        }}
      </SizeMe>
    );
  }
}

export default SvgBranches;
