import React, { Component } from "react";

import "./styles/";
class Tooltip extends Component {
  render() {
    var { value, label, x, y, color } = this.props,
      style;

    style = {
      left: ~~x,
      top: ~~y
    };

    return (
      <span className="LineChart--tooltip" style={style}>
        <b style={{ color: color }}>{label}</b>
        <i>{value}</i>
      </span>
    );
  }
}

export default Tooltip;
