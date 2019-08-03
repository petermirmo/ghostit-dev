import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import GIContainer from "../GIContainer";

import "./style.css";

class Modal extends Component {
  render() {
    const { body, className, footer, header, showClose = true } = this.props; // Variables
    const { close } = this.props; // Functions
    return (
      <GIContainer className="modal0-content column">
        {showClose && (
          <FontAwesomeIcon
            icon={faTimes}
            size="2x"
            className="close"
            onClick={close}
          />
        )}
        {header && (
          <GIContainer className="modal0-header">{header}</GIContainer>
        )}
        <GIContainer className="modal0-body">{body}</GIContainer>
        {footer && (
          <GIContainer className="modal0-footer">{footer}</GIContainer>
        )}
      </GIContainer>
    );
  }
}

export default Modal;
