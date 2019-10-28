import React, { Component } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";

import GIContainer from "../../containers/GIContainer";

class CheckBox extends Component {
  render() {
    const { active } = this.props;

    let className = "full-center br4 pa2";
    if (active) className += " bg-seven-blue common-border seven-blue thick";
    else className += " common-border dark thick";

    return (
      <GIContainer className={className}>
        <FontAwesomeIcon icon={faCheck} className="white" />
      </GIContainer>
    );
  }
}

export default CheckBox;
