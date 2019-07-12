import React from "react";

export const getHtmlElement = props => {
  let { className } = props;
  const { children, style, testMode, text, type } = props;

  if (testMode) className += " gt-test-mode";

  if (type === "h1") {
    return (
      <h1 className={className} style={style}>
        {text}
      </h1>
    );
  } else if (type === "h2") {
    return (
      <h2 className={className} style={style}>
        {text}
      </h2>
    );
  } else if (type === "h3") {
    return (
      <h3 className={className} style={style}>
        {text}
      </h3>
    );
  } else if (type === "h4") {
    return (
      <h4 className={className} style={style}>
        {text}
      </h4>
    );
  } else if (type === "h5") {
    return (
      <h5 className={className} style={style}>
        {text}
      </h5>
    );
  } else if (type === "h6") {
    return (
      <h6 className={className} style={style}>
        {text}
      </h6>
    );
  } else if (type === "p") {
    return (
      <p className={className} style={style}>
        {text}
      </p>
    );
  } else if (type === "label") {
    return (
      <label className={className} style={style}>
        {children}
      </label>
    );
  }
};
