import React, { Component } from "react";

import "./style.css";

class Container extends Component {
  render() {
    const {
      children,
      containerType,
      testMode,
      style,
      onMouseClick
    } = this.props; // Variables
    let { className } = this.props;

    if (testMode) className += " test-mode";

    return (
      <div
        className={`main-container ${className}`}
        style={style}
        onClick={onMouseClick}
      >
        {children}
      </div>
    );
  }
}

export default Container;
