import React, { Component } from "react";

import Tooltip from "./Tooltip";
import XAxis from "./XAxis";
import YAxis from "./YAxis";
import Curve from "./Curve";
import Points from "./Points";

import "./styles/";

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = this.stateVariable();
  }
  stateVariable = () => {
    return {
      tooltip: false,
      value: "",
      dataSet: 0,
      index: 0,
      x: 0,
      y: 0,
      color: ""
    };
  };
  componentWillReceiveProps() {
    this.setState({ updating: true }, this.endUpdate);
  }
  endUpdate = () => {
    setTimeout(() => this.setState({ updating: false }), 300);
  };

  showTooltip = (point, dataSetIndex, index) => {
    this.setState({
      updating: false,
      tooltip: true,
      value: point[2],
      dataSet: dataSetIndex,
      index,
      x: point[0],
      y: point[1],
      color: point[3]
    });
  };

  hideTooltip = () => {
    this.setState(this.stateVariable());
  };

  render() {
    var { data, lines, area, dots, stroke, radius, grid, axis } = this.props,
      width = this.props.width || 400,
      height = this.props.height || width * (9 / 16),
      colors = this.props.colors || ["#aaa", "#888"],
      labels = this.props.labels || [],
      hideLabels = this.props.hideLabels || false,
      size = data[0].length - 1,
      maxValue = 0,
      heightRatio = 1,
      padding = this.props.padding || 50,
      dataSet = [],
      grid = typeof grid !== "undefined" ? grid : true,
      stroke = stroke || 1,
      radius = radius || 3;

    // Calculate the maxValue
    data.forEach(points => {
      // Max value of points array
      let max = Math.max.apply(null, points);
      // Max value of all the points arrays
      if (max > maxValue) maxValue = max;
    });

    // Y ratio
    if (maxValue === 0) heightRatio = 1;
    else heightRatio = height / maxValue;

    // Calculate the coordinates
    dataSet = data.map((points, dataIndex) => {
      return points.map((point, pointIndex) => [
        ~~((width / size) * pointIndex + padding) + 0.5, // x
        ~~(heightRatio * (maxValue - point) + padding) + 0.5, // y
        point, // value
        colors[dataIndex % colors.length] // color
      ]);
    });

    return (
      <span className="LineChart" style={{ width: width + 2 * padding }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width + padding * 2 + "px"}
          height={height + 2 * padding + "px"}
          viewBox={
            "0 0 " + (width + 2 * padding) + " " + (height + 2 * padding)
          }
        >
          {grid && (
            <g>
              <XAxis
                maxValue={maxValue}
                padding={padding}
                width={width}
                height={height}
              />
              <YAxis
                axis={axis}
                padding={padding}
                width={width}
                height={height}
              />
            </g>
          )}

          {dataSet.map((points, dataIndex) => {
            return (
              <g key={dataIndex}>
                <Curve
                  points={points}
                  dataSetIndex={dataIndex}
                  lines={lines}
                  area={area}
                  width={width}
                  height={height}
                  padding={padding}
                  color={colors[dataIndex % colors.length]}
                  updating={this.state.updating}
                  stroke={stroke}
                />

                <Points
                  hideLabels={hideLabels}
                  dots={dots}
                  label={labels[dataIndex]}
                  points={points}
                  dataSetIndex={dataIndex}
                  showTooltip={this.showTooltip}
                  hideTooltip={this.hideTooltip}
                  stroke={stroke}
                  radius={radius}
                />
              </g>
            );
          })}
        </svg>

        {this.state.tooltip && (
          <Tooltip
            value={this.state.value}
            label={labels[this.state.dataSet]}
            x={this.state.x}
            y={this.state.y - 15}
            color={this.state.color}
          />
        )}

        <svg height="400" width="450">
          <path
            id="lineAB"
            d="M 100 350 l 150 -300"
            stroke="red"
            strokeWidth="3"
            fill="none"
          />
          <path
            id="lineBC"
            d="M 250 50 l 150 300"
            stroke="red"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 175 200 l 150 0"
            stroke="green"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 100 350 q 150 -300 300 0"
            stroke="blue"
            strokeWidth="5"
            fill="none"
          />
          <g stroke="black" strokeWidth="3" fill="black">
            <circle id="pointA" cx="100" cy="350" r="3" />
            <circle id="pointB" cx="250" cy="50" r="3" />
            <circle id="pointC" cx="400" cy="350" r="3" />
          </g>
          <g
            fontSize="30"
            fontFamily="sans-serif"
            fill="black"
            stroke="none"
            textAnchor="middle"
          >
            <text x="100" y="350" dx="-30">
              A
            </text>
            <text x="250" y="50" dy="-10">
              B
            </text>
            <text x="400" y="350" dx="30">
              C
            </text>
          </g>
          Sorry, your browser does not support inline SVG.
        </svg>
      </span>
    );
  }
}

export default LineChart;
