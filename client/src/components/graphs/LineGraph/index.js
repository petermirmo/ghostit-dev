import React, { Component } from "react";
import sizeMe from "react-sizeme";

import GIContainer from "../../containers/GIContainer";

import {
  createBackground,
  createDataLine,
  createHorizontalLines,
  createVerticalLines,
  getGraphVariables,
  xAxis,
  yAxis
} from "./util";

import "./style.css";

class LineGraph extends Component {
  render() {
    const { className, horizontalTitles, line, size } = this.props; /// Variables
    const { height, width } = size;

    const {
      paddingSideMultiplier,
      verticalTitles,
      xMax,
      yMax,
      yMin
    } = getGraphVariables(line);

    const { dataPointDivs, dataLine } = createDataLine(
      paddingSideMultiplier,
      line,
      size,
      verticalTitles,
      xMax,
      yMax,
      yMin
    );

    return (
      <GIContainer className={className}>
        <svg className="line-chart" width={width}>
          {createBackground(dataLine, paddingSideMultiplier, size, xMax)}
          {xAxis(paddingSideMultiplier, size, xMax)}
          {createVerticalLines(
            horizontalTitles,
            paddingSideMultiplier,
            size,
            verticalTitles,
            xMax
          )}
          {createHorizontalLines(
            paddingSideMultiplier,
            size,
            verticalTitles,
            xMax,
            yMax,
            yMin
          )}
          {dataLine.map((data, index) => {
            const { x1, x2, y1, y2 } = data;

            return (
              <path
                className="line-chart-connecting"
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                key={index}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {dataPointDivs}
        </svg>
      </GIContainer>
    );
  }
}

export default sizeMe({ monitorHeight: true })(LineGraph);
