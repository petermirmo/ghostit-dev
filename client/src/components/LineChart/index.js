import React, { Component } from "react";

import "./styles/";

const LINE_CHART_HEIGHT_RATIO = 40;

class LineChart extends Component {
  getMaxMinXYValues = lines => {
    let yMax;
    let yMin = 0;
    let xMax = 0;

    // Loop through every line
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      let currentXMax = 0;

      // Loop through every data point in a line
      for (let j = 0; j < line.length; j++) {
        currentXMax++;
        // If values have not been initiated then set to this value
        // We do not set immediately because we have no idea what the data points are
        // They could be positive or negative
        if (!yMax) yMax = line[j];

        if (line[j] > yMax) yMax = line[j];
        if (line[j] < yMin) yMin = line[j];
      }
      if (currentXMax > xMax) xMax = currentXMax;
      currentXMax = 0;
    }
    return { yMax, yMin, xMax };
  };
  createVerticalLines = xMax => {
    let verticalLineDivs = [];
    for (let i = 0; i < xMax; i++) {
      if (i === 0) continue;
      let x = (i / (xMax - 1)) * 100;

      verticalLineDivs.push(
        <path
          className="line-chart-vertical-line"
          d={"M" + x + ",0 L " + x + "," + LINE_CHART_HEIGHT_RATIO}
          key={x + "line"}
          vectorEffect="non-scaling-stroke"
        />
      );
    }
    return verticalLineDivs;
  };
  createDataLines = (lines, xMax, yMax, yMin, colors) => {
    let dataPointDivs = [];
    let dataLineDivs = [];

    lines.map((line, lineIndex) => {
      let prevDataPoint;
      line.map((dataValue, dataIndex) => {
        let x = (dataIndex / (xMax - 0.9)) * 100;
        let y = (dataValue / yMax) * LINE_CHART_HEIGHT_RATIO;

        y = LINE_CHART_HEIGHT_RATIO - y;

        if (prevDataPoint) {
          let paddingWidth = 2;

          let x1 = prevDataPoint.x;
          let y1 = prevDataPoint.y;
          let x2 = x;
          let y2 = y;

          let pheta = Math.atan((y2 - y1) / (x2 - x1));
          let yPadding = paddingWidth * Math.sin(pheta);
          let xPadding = paddingWidth * Math.cos(pheta);

          dataLineDivs.push(
            <path
              style={{ stroke: colors[lineIndex] }}
              className="line-chart-connecting-line"
              d={
                "M" +
                (x1 + xPadding) +
                "," +
                (y1 + yPadding) +
                " L " +
                (x2 - xPadding) +
                "," +
                (y2 - yPadding) +
                ""
              }
              key={dataIndex + "line" + lineIndex}
              vectorEffect="non-scaling-stroke"
            />
          );
        }

        dataPointDivs.push(
          <circle
            style={{ stroke: colors[lineIndex], fill: colors[lineIndex] }}
            className="line-chart-data-point"
            cx={x}
            cy={y}
            key={dataIndex + "circle" + lineIndex}
            vectorEffect="non-scaling-stroke"
          />
        );
        prevDataPoint = { x, y };
      });
    });
    return { dataPointDivs, dataLineDivs };
  };
  XAxis = () => {
    return (
      <path
        className="line-chart-axis"
        d={
          "M 0," + LINE_CHART_HEIGHT_RATIO + " L 100," + LINE_CHART_HEIGHT_RATIO
        }
        vectorEffect="non-scaling-stroke"
      />
    );
  };
  YAxis = () => {
    return (
      <path
        className="line-chart-axis"
        d={"M 0,0 L 0," + LINE_CHART_HEIGHT_RATIO}
        vectorEffect="non-scaling-stroke"
      />
    );
  };
  render() {
    let { lines, colors } = this.props;
    let { yMax, yMin, xMax } = this.getMaxMinXYValues(lines);
    let { dataPointDivs, dataLineDivs } = this.createDataLines(
      lines,
      xMax,
      yMax,
      yMin,
      colors
    );

    return (
      <svg
        className="line-chart pa32"
        viewBox={"0 0 100 " + LINE_CHART_HEIGHT_RATIO}
        preserveAspectRatio="none"
      >
        {this.XAxis()}
        {this.YAxis()}
        {this.createVerticalLines(xMax)}
        {dataLineDivs}
        {dataPointDivs}
      </svg>
    );
  }
}

export default LineChart;
