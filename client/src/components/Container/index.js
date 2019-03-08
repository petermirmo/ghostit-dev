import React, { Component } from "react";

import "./style.css";

class Container extends Component {
  render() {
    const { style, className, children } = this.props; // Variables

    return (
      <div className={`main-container ${className}`} style={style}>
        {children}
      </div>
    );
  }
}

export default Container;
