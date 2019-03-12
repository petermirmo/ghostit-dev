import React, { Component } from "react";

import "./style.css";

class SquareButton extends Component {
  render() {
    const { text, onClick, className, style, name, type } = this.props;
    return (
      <button
        onClick={onClick}
        style={style}
        className={`square-button ${className}`}
        type={type}
        name={name}
      >
        {text}
      </button>
    );
  }
}

export default SquareButton;
