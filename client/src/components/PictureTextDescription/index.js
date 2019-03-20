import React, { Component } from "react";

import GIContainer from "../containers/GIContainer";
import GIText from "../views/GIText";

import { mobileAndTabletcheck } from "../../componentFunctions";

import "./style.css";

class PictureTextDescription extends Component {
  render() {
    const { title, description, svg, direction } = this.props;

    let className = "x-wrap full-center mt16";

    let textDirectionClassName = "tar";

    if (direction === "left") {
      className += " reverse";
      textDirectionClassName = "tal";
    }
    if (mobileAndTabletcheck()) textDirectionClassName = "tac";

    return (
      <GIContainer className={className}>
        <GIContainer className="column full-center" style={{ flex: 1 }}>
          <GIContainer className="column container-box small">
            <GIText text={title} type="h1" className={textDirectionClassName} />
            <GIText
              className={textDirectionClassName}
              text={description}
              type="p"
            />
          </GIContainer>
        </GIContainer>
        <GIContainer
          className="full-center y-fill container-box large"
          style={{ flex: 0.8 }}
        >
          <img src={`src/svgs/${svg}.svg`} className="fill-parent" />
        </GIContainer>
      </GIContainer>
    );
  }
}

export default PictureTextDescription;
