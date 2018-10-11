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
      index: index,
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
    dataSet = data.forEach(pts => {
      var max = Math.max.apply(null, pts);
      maxValue = max > maxValue ? max : maxValue;
    });

    // Y ratio
    if (maxValue === 0) {
      heightRatio = 1;
    } else {
      heightRatio = height / maxValue;
    }

    // Calculate the coordinates
    dataSet = data.map((pts, di) =>
      pts.map((pt, pi) => [
        ~~((width / size) * pi + padding) + 0.5, // x
        ~~(heightRatio * (maxValue - pt) + padding) + 0.5, // y
        pt, // value
        colors[di % colors.length] // color
      ])
    );

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
          {grid ? (
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
          ) : null}

          {dataSet.map((p, pi) => (
            <g key={pi}>
              <Curve
                points={p}
                dataSetIndex={pi}
                lines={lines}
                area={area}
                width={width}
                height={height}
                padding={padding}
                color={colors[pi % colors.length]}
                updating={this.state.updating}
                stroke={stroke}
              />

              <Points
                hideLabels={hideLabels}
                dots={dots}
                label={labels[pi]}
                points={p}
                dataSetIndex={pi}
                showTooltip={this.showTooltip}
                hideTooltip={this.hideTooltip}
                stroke={stroke}
                radius={radius}
              />
            </g>
          ))}
        </svg>

        {this.state.tooltip ? (
          <Tooltip
            value={this.state.value}
            label={labels[this.state.dataSet]}
            x={this.state.x}
            y={this.state.y - 15}
            color={this.state.color}
          />
        ) : null}
      </span>
    );
  }
}

export default LineChart;
