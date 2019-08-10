import React, { Component } from "react";
import sizeMe from "react-sizeme";

import GIContainer from "../../containers/GIContainer";

import { someFunction } from "./util";

import "./style.css";

class PieGraph extends Component {
  render() {
    const { className, size, something } = this.props; /// Variables
    const { height, width } = size;

    const getStuff = someFunction(something);

    return (
      <GIContainer className={className}>
        <svg className="line-chart" width={width}>
          <g transform={`translate(${width / 2},${height / 2})`}>
            <path d="M 0,0 L -70,70 A 99 99 0 0 1 -70,-70" fill="#f00" />
            <path d="M 0,0 L -70,-70 A 99 99 0 0 1 70,-70" fill="#060" />
            <path d="M 0,0 L 70,-70 A 99 99 0 0 1 70,70" fill="#dd0" />
            <path d="M 0,0 L 70,70 A 99 99 0 0 1 -70,70" fill="#04e" />
          </g>
        </svg>
      </GIContainer>
    );
  }
}

export default sizeMe({ monitorHeight: true })(PieGraph);
