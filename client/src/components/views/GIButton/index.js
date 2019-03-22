import React, { Component } from "react";

import "./style.css";

class GIButton extends Component {
  render() {
    const {
      text,
      onClick,
      className,
      style,
      name,
      type,
      children
    } = this.props;
    return (
      <button
        onClick={onClick}
        style={style}
        className={className}
        type={type}
        name={name}
      >
        {text}
        {children}
      </button>
    );
  }
}

export default GIButton;
