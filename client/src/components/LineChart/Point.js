import React, { Component } from "react";

import "./styles/";

class Point extends Component {
  mouseEnter = () => {
    this.props.showTooltip(
      this.props.point,
      this.props.dataSetIndex,
      this.props.index
    );
  };

  mouseLeave = () => {
    this.props.hideTooltip();
  };

  render() {
    var { point, stroke, radius } = this.props,
      x = point[0],
      y = point[1],
      color = point[3];

    return (
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={color}
        strokeWidth={stroke}
        stroke={"#ffffff"}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      />
    );
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default Point;
