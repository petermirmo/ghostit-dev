import React, { Component } from "react";

import GIContainer from "../containers/GIContainer";
import GIText from "../views/GIText";

import "./style.css";

class PictureTextDescription extends Component {
  render() {
    const { title, description, svg, size, direction } = this.props;

    let className = "x-wrapping full-center";
    let paddingLeft = "0%";

    if (size === "large") className += " half-screen";
    if (direction === "left") {
      className += " reverse";
      paddingLeft = "0%";
    }

    return (
      <GIContainer className={className}>
        <GIContainer
          className="y-wrapping full-center fit-parent"
          style={{ width: "40%" }}
        >
          <GIContainer
            className="y-wrapping"
            style={{ paddingLeft: paddingLeft, width: "60%" }}
          >
            <GIText text={title} type="h3" />
            <GIText text={description} type="p" />
          </GIContainer>
        </GIContainer>
        <GIContainer
          style={{ width: "60%" }}
          className="full-center fit-parent"
        >
          {svg}
        </GIContainer>
      </GIContainer>
    );
  }
}

export default PictureTextDescription;
