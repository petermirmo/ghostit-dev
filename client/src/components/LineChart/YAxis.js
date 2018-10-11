import React, { Component } from "react";

import "./styles/";
class YAxis extends Component {
  render() {
    var padding = this.props.padding,
      lines = [0, 1, 2, 3, 4],
      segment = this.props.width / 4,
      height = this.props.height + padding,
      axis = this.props.axis;

    return (
      <g>
        {lines.map((l, li) => {
          var x = ~~(li * segment + padding) + 0.5;
          return (
            <g key={x}>
              <line
                x1={x}
                y1={padding}
                x2={x}
                y2={height}
                stroke="#eaeaea"
                strokeWidth="1px"
              />
              <text
                className="LineChart--axis"
                x={x}
                y={height + 15}
                textAnchor="middle"
              >
                {axis[li % axis.length]}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
}

export default YAxis;
