import React, { Component } from "react";

import "./style.css";

class SquareButton extends Component {
  render() {
    const { text, onClick, className, style } = this.props;
    return (
      <button
        onClick={onClick}
        style={style}
        className={`square-button ${className}`}
      >
        {text}
      </button>
    );
  }
}

export default SquareButton;
