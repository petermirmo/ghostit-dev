import React, { Component } from "react";

import "./style.css";

class Container extends Component {
  render() {
    const { children, className, containerType, testMode, style } = this.props; // Variables
    let className2;

    if (containerType === 1) className2 += " container1";
    else if (containerType === 2) className2 += " container2";
    else if (containerType === 3) className2 += " container3";
    else if (containerType === 4) className2 += " container4";

    if (testMode) style.backgroundColor = "blue";

    return (
      <div
        className={`main-container ${className} ${className2}`}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default Container;
