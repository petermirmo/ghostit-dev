import React, { Component } from "react";

import "./style.css";

// fc = findComponent
class Container extends Component {
  render() {
    const { style, className, children, fc } = this.props; // Variables

    if (fc) style.backgroundColor = "blue";

    return (
      <div className={`main-container ${className}`} style={style}>
        {children}
      </div>
    );
  }
}

export default Container;
