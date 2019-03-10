import React, { Component } from "react";

import { getHtmlElement } from "./util";
import "./style.css";

class GIText extends Component {
  render() {
    const { text, type } = this.props;
    return getHtmlElement(type, text);
  }
}

export default GIText;
