import React, { Component } from "react";

import GIContainer from "../containers/GIContainer";
import GIText from "../views/GIText";

import "./style.css";

class PictureTextDescription extends Component {
  render() {
    const { title, description, svg, size, direction } = this.props;

    let className = "x-wrap full-center mt16";
    let paddingLeft = "0%";

    let textDirectionClassName = "tar";

    if (size === "large") className += " half-screen";
    if (direction === "left") {
      className += " reverse";
      paddingLeft = "0%";
      textDirectionClassName = "tal";
    }

    return (
      <GIContainer className={className}>
        <GIContainer
          className="y-wrap full-center fit-parent"
          style={{ width: "40%" }}
        >
          <GIContainer
            className="y-wrap"
            style={{ paddingLeft: paddingLeft, width: "60%" }}
          >
            <GIText text={title} type="h3" className={textDirectionClassName} />
            <GIText
              text={description}
              type="p"
              className={textDirectionClassName}
            />
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
