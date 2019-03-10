import React, { Component } from "react";

import { getHtmlElement } from "./util";
import "./style.css";

class GIText extends Component {
  render() {
    const { text, type, style, className } = this.props;
    return getHtmlElement(type, text, style, className);
  }
}

export default GIText;
