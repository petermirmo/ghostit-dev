import React, { Component } from "react";

import Point from "./Point";
import "./styles/";
class Points extends Component {
  render() {
    var {
        points,
        dataSetIndex,
        showTooltip,
        hideTooltip,
        radius,
        stroke,
        label,
        dots,
        hideLabels
      } = this.props,
      lastPoint = points[points.length - 1],
      color = lastPoint[3],
      x = lastPoint[0],
      y = lastPoint[1];

    return (
      <g>
        {dots === true
          ? points.map((p, pi) => (
              <Point
                point={p}
                dataSetIndex={dataSetIndex}
                showTooltip={showTooltip}
                hideTooltip={hideTooltip}
                stroke={stroke}
                radius={radius}
                index={pi}
                key={pi}
              />
            ))
          : null}

        {hideLabels !== true ? (
          <text className="LineChart--label" x={x + 5} y={y + 2} fill={color}>
            {label}
          </text>
        ) : null}
      </g>
    );
  }
}

export default Points;
