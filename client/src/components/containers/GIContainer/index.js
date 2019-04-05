import React, { Component } from "react";

import "./style.css";

class Container extends Component {
  render() {
    const {
      children,
      containerType,
      testMode,
      style,
      onClick
    } = this.props; // Variables
    let { className } = this.props;

    if (testMode) className += " test-mode";

    return (
      <div
        className={`main-container ${className}`}
        style={style}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
}

export default Container;
