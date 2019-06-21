import React from "react";

const PADDING = 16;
const INITIAL_BOX_PADDING = 0.4;
const MULTIPLE_OF_YMAX = 1.5;

const getDecimalPlaces = yMax => {
  if (yMax < 5) return 2;
  else return 0;
};

const getX = (index, paddingSideMultiplier, width, xMax) => {
  return (
    (index / (xMax + 1)) * (width - PADDING * paddingSideMultiplier) +
    PADDING * paddingSideMultiplier
  );
};
const getY = (height, index, verticalTitles) => {
  return ((height - PADDING) / verticalTitles) * index;
};

const getYDataPoint = (dataValue, height, yMax) => {
  // We add the (1 / 6) * yMax because the top squares aren't used in graph
  return (
    height -
    PADDING -
    (dataValue / (yMax + (1 / 6) * yMax)) * (height - PADDING)
  );
};

export const createBackground = (
  dataLine,
  paddingSideMultiplier,
  size,
  xMax
) => {
  const { height, width } = size;

  let path = `M ${getX(1, paddingSideMultiplier, width, xMax)} ${height -
    PADDING}`;

  for (let index in dataLine) {
    const { x1, x2, y1, y2 } = dataLine[index];
    path += `L ${x1} ${y1} L ${x2} ${y2} `;
  }
  path += `L ${getX(xMax, paddingSideMultiplier, width, xMax)} ${height -
    PADDING}`;

  return (
    <g>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#b6ecff", stopOpacity: 1 }} />
        <stop
          offset="100%"
          style={{ stopColor: "rgb(255,255,255,0)", stopOpacity: 1 }}
        />
      </linearGradient>
      <path d={path} fill="url(#grad1)" vectorEffect="non-scaling-stroke" />
    </g>
  );
};

export const createDataLine = (
  paddingSideMultiplier,
  line,
  size,
  xMax,
  yMax,
  yMin
) => {
  const { height, width } = size;

  let dataPointDivs = [];
  let dataLine = [];

  let prevDataPoint;

  for (let dataIndex = 1; dataIndex <= line.length; dataIndex++) {
    const dataValue = line[dataIndex - 1];
    const x = getX(dataIndex, paddingSideMultiplier, width, xMax);

    const y = getYDataPoint(dataValue, height, yMax);

    if (prevDataPoint) {
      const x1 = prevDataPoint.x;
      const y1 = prevDataPoint.y;
      const x2 = x;
      const y2 = y;

      dataLine.push({ x1, x2, y1, y2 });
    }

    dataPointDivs.push(
      <g key={dataIndex}>
        <circle
          className="line-chart-data-point"
          cx={x}
          cy={y}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    );
    prevDataPoint = { x, y };
  }

  return { dataPointDivs, dataLine };
};

export const createHorizontalLines = (
  paddingSideMultiplier,
  size,
  verticalTitles,
  xMax,
  yMax
) => {
  const { height, width } = size;

  let horizontalLineDivs = [];
  for (let index = 1; index <= verticalTitles; index++) {
    const y = getY(height, index, verticalTitles);

    const boxSize =
      getX(2, paddingSideMultiplier, width, xMax) -
      getX(1, paddingSideMultiplier, width, xMax);

    const displayHorizontalTitle = (
      yMax -
      (yMax / (verticalTitles - 1)) * (index - 1)
    ).toFixed(getDecimalPlaces(yMax));

    horizontalLineDivs.push(
      <g key={index} className="test">
        {index !== verticalTitles && (
          <path
            className="line-chart-vertical"
            d={`M ${PADDING * paddingSideMultiplier +
              boxSize * INITIAL_BOX_PADDING},${y} L ${width -
              boxSize * INITIAL_BOX_PADDING},${y}`}
            vectorEffect="non-scaling-stroke"
          />
        )}
        <text alignmentBaseline="middle" className="bold" x={0} y={y}>
          {displayHorizontalTitle}
        </text>
      </g>
    );
  }
  return horizontalLineDivs;
};
export const createVerticalLines = (
  horizontalTitles,
  paddingSideMultiplier,
  size,
  verticalTitles,
  xMax
) => {
  const { height, width } = size;

  let verticalLineDivs = [];
  for (let i = 1; i <= xMax; i++) {
    const x = getX(i, paddingSideMultiplier, width, xMax);

    const boxSize =
      getY(height, 2, verticalTitles) - getY(height, 1, verticalTitles);

    verticalLineDivs.push(
      <g key={i}>
        <path
          className="line-chart-vertical"
          d={`M ${x} ${boxSize * INITIAL_BOX_PADDING} L ${x} ${height -
            PADDING}`}
          vectorEffect="non-scaling-stroke"
        />
        <text className="five-blue" textAnchor="middle" x={x} y={height}>
          {horizontalTitles[i - 1]}
        </text>
      </g>
    );
  }
  return verticalLineDivs;
};

export const getSomething = line => {
  let paddingSideMultiplier = 1;
  let verticalTitles = 7;
  let xMax = 0;
  let yMax;
  let yMin = 0;

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
  yMax = yMax * MULTIPLE_OF_YMAX;

  /*
  if (yMax <= 1) verticalTitles = 2;
  else if (yMax <= 2) verticalTitles = 3;
  else if (yMax <= 3) verticalTitles = 4;
  else if (yMax <= 4) verticalTitles = 5;
  */

  for (let index = 0; index <= verticalTitles; index++) {
    const verticalTitleStringLength =
      String(
        (yMax - (yMax / verticalTitles) * index).toFixed(getDecimalPlaces(yMax))
      ).length / 4;

    if (verticalTitleStringLength > paddingSideMultiplier)
      paddingSideMultiplier = verticalTitleStringLength;
  }
  return { paddingSideMultiplier, verticalTitles, yMax, yMin, xMax };
};

export const xAxis = (paddingSideMultiplier, size, xMax) => {
  const { width, height } = size;

  const boxSize =
    getX(2, paddingSideMultiplier, width, xMax) -
    getX(1, paddingSideMultiplier, width, xMax);

  return (
    <path
      className="line-chart-axis"
      d={`M ${PADDING * paddingSideMultiplier +
        boxSize * INITIAL_BOX_PADDING},${height - PADDING}L${width -
        boxSize * INITIAL_BOX_PADDING},${height - PADDING}`}
      vectorEffect="non-scaling-stroke"
    />
  );
};
export const yAxis = size => {
  const { width, height } = size;

  return (
    <path
      className="line-chart-axis"
      d={"M 0,0 L 0," + width}
      vectorEffect="non-scaling-stroke"
    />
  );
};
