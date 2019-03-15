import React, { Component } from "react";

import GIContainer from "../containers/GIContainer";
import "./style.css";

class SvgBranch extends Component {
  render() {
    const { branches } = this.props;
    return (
      <svg viewBox="0 0 100 100">
        <circle cx="10" cy="10" className="branch-point large" />
        <path d="M 10,10 L 10, 90" className="test" />
        {branches.map((branch, index) => (
          <GIContainer key={index}>{branch}</GIContainer>
        ))}
        <g>hello world</g>

        <circle cx="10" cy="90" className="branch-point large" />
      </svg>
    );
  }
}

export default SvgBranch;
