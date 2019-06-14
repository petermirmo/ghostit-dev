import React, { Component } from "react";
import sizeMe from "react-sizeme";

import GIContainer from "../containers/GIContainer";

import "./style.css";

const PADDING = 24;
const PADDING_SIDE_MULTIPLIER = 4;

class LineChart extends Component {
  getMaxMinXYValues = line => {
    let yMax;
    let yMin = 0;
    let xMax = 0;
    if (line) {
      let currentXMax = 0;

      // Loop through every data point in a line
      for (let index = 0; index < line.length; index++) {
        currentXMax++;
        // If values have not been initiated then set to this value
        // We do not set immediately because we have no idea what the data points are
        // They could be positive or negative
        if (!yMax) yMax = line[index];

        if (line[index] > yMax) yMax = line[index];
        if (line[index] < yMin) yMin = line[index];
      }
      if (currentXMax > xMax) xMax = currentXMax;
      currentXMax = 0;
    }
    if (!yMax) yMax = 1;
    return { yMax, yMin, xMax };
  };
  createVerticalLine = (xMax, horizontalTitles) => {
    const { width, height } = this.props.size;

    let verticalLineDivs = [];
    for (let i = 0; i <= xMax; i++) {
      const x =
        (i / (xMax - 1)) * (width - PADDING * PADDING_SIDE_MULTIPLIER) +
        PADDING * PADDING_SIDE_MULTIPLIER;

      verticalLineDivs.push(
        <g key={i}>
          <path
            className="line-chart-vertical-line"
            d={"M" + x + ",0 L " + x + "," + (height - PADDING)}
            key={i}
            vectorEffect="non-scaling-stroke"
          />
          <text className="five-blue" textAnchor="middle" x={x} y={height}>
            {horizontalTitles[i]}
          </text>
        </g>
      );
    }
    return verticalLineDivs;
  };
  createDataLine = (line, xMax, yMax, yMin) => {
    const { width } = this.props.size;
    let { height } = this.props.size;
    height -= PADDING;

    let dataPointDivs = [];
    let dataLineDivs = [];

    let prevDataPoint;

    for (let dataIndex in line) {
      const dataValue = line[dataIndex];
      const x =
        (dataIndex / (xMax - 1)) * (width - PADDING * PADDING_SIDE_MULTIPLIER) +
        PADDING * PADDING_SIDE_MULTIPLIER;
      let y = (dataValue / yMax) * height;

      y = height - y;

      if (prevDataPoint) {
        const x1 = prevDataPoint.x;
        const y1 = prevDataPoint.y;
        const x2 = x;
        const y2 = y;

        dataLineDivs.push(
          <path
            className="line-chart-connecting-line"
            d={"M" + x1 + "," + y1 + " L " + x2 + "," + y2 + ""}
            key={dataIndex + "line"}
            vectorEffect="non-scaling-stroke"
          />
        );
      }

      dataPointDivs.push(
        <circle
          className="line-chart-data-point"
          cx={x}
          cy={y}
          key={dataIndex + "circle"}
          vectorEffect="non-scaling-stroke"
        />
      );
      prevDataPoint = { x, y };
    }

    return { dataPointDivs, dataLineDivs };
  };
  XAxis = () => {
    const { width, height } = this.props.size;

    return (
      <path
        className="line-chart-axis"
        d={`M ${PADDING * PADDING_SIDE_MULTIPLIER},${height -
          PADDING}L${width},${height - PADDING}`}
        vectorEffect="non-scaling-stroke"
      />
    );
  };
  YAxis = () => {
    const { width, height } = this.props.size;

    return (
      <path
        className="line-chart-axis"
        d={"M 0,0 L 0," + width}
        vectorEffect="non-scaling-stroke"
      />
    );
  };
  render() {
    const {
      className,
      horizontalTitles,
      line,
      size,
      verticalTitles
    } = this.props; /// Variables
    const { height, width } = size;

    const { xMax, yMax, yMin } = this.getMaxMinXYValues(line);

    const { dataPointDivs, dataLineDivs } = this.createDataLine(
      line,
      xMax,
      yMax,
      yMin
    );

    return (
      <GIContainer className={className}>
        <svg className="line-chart" width={width}>
          {this.XAxis()}
          {this.createVerticalLine(xMax, horizontalTitles)}
          {dataLineDivs}
          {dataPointDivs}
        </svg>
      </GIContainer>
    );
  }
}

export default sizeMe({ monitorHeight: true })(LineChart);
