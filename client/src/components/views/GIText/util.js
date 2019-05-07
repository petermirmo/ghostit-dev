import React from "react";

export const getHtmlElement = props => {
  const { children, className, style, text, type } = props;
  if (type === "h1") {
    return (
      <h1 style={style} className={className}>
        {text}
      </h1>
    );
  } else if (type === "h2") {
    return (
      <h2 style={style} className={className}>
        {text}
      </h2>
    );
  } else if (type === "h3") {
    return (
      <h3 style={style} className={className}>
        {text}
      </h3>
    );
  } else if (type === "h4") {
    return (
      <h4 style={style} className={className}>
        {text}
      </h4>
    );
  } else if (type === "h5") {
    return (
      <h5 style={style} className={className}>
        {text}
      </h5>
    );
  } else if (type === "h6") {
    return (
      <h6 style={style} className={className}>
        {text}
      </h6>
    );
  } else if (type === "p") {
    return (
      <p style={style} className={className}>
        {text}
      </p>
    );
  } else if (type === "label") {
    return (
      <label style={style} className={className}>
        {children}
      </label>
    );
  }
};
