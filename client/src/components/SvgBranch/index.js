import React, { Component } from "react";
import sizeMe from "react-sizeme";

import GIContainer from "../containers/GIContainer";

import "./style.css";

class SvgBranch extends Component {
  render() {
    const { start, end, size } = this.props;

    let { width, height } = size;

    const svgPaddingX = 0.2 * width;
    const lineY = height / 2;

    let svgPaddingTop = 0;
    let svgPaddingBottom = 0;

    if (start) svgPaddingTop = 0.1 * height;
    if (end) svgPaddingBottom = 0.1 * height;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="fill-parent">
        <path
          d={`M ${svgPaddingX},${svgPaddingTop} L ${svgPaddingX}, ${height -
            svgPaddingBottom}`}
          className="branch"
        />

        <path
          className="branch"
          d={`M ${svgPaddingX},${lineY} L ${width - svgPaddingX},${lineY}`}
        />
        <circle cx={svgPaddingX} cy={lineY} className="branch-point" />

        <circle cx={width - svgPaddingX} cy={lineY} className="branch-point" />

        {start && (
          <circle
            cx={svgPaddingX}
            cy={svgPaddingTop}
            className="branch-point large"
          />
        )}
        {end && (
          <circle
            cx={svgPaddingX}
            cy={height - svgPaddingBottom}
            className="branch-point large"
          />
        )}
      </svg>
    );
  }
}

export default sizeMe({ monitorHeight: true })(SvgBranch);
