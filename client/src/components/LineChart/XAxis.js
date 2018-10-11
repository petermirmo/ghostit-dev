import React, { Component } from "react";

import "./styles/";

class XAxis extends Component {
  render() {
    var padding = this.props.padding,
      lines = [1, 2, 3],
      segment = this.props.height / 4,
      maxValue = ~~(this.props.maxValue / 4);

    return (
      <g>
        {lines.map((l, lineIndex) => {
          var y = ~~(l * segment + padding) + 0.5;
          return (
            <g key={y}>
              <line
                x1={padding}
                y1={y}
                x2={this.props.width + padding}
                y2={y}
                stroke="#eaeaea"
                strokeWidth="1px"
              />

              <text
                className="LineChart--axis"
                x={padding - 10}
                y={y + 2}
                textAnchor="end"
              >
                {maxValue * (3 - lineIndex)}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
}

export default XAxis;
