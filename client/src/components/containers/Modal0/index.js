import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons/faTimes";

import GIContainer from "../GIContainer";

import "./style.css";

class Modal0 extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const {
      body,
      children,
      className,
      footer,
      header,
      showClose = true
    } = this.props; // Variables
    const { close } = this.props; // Functions
    return (
      <GIContainer className="modal0-content column">
        {showClose && (
          <FontAwesomeIcon
            className="close"
            icon={faTimes}
            onClick={close}
            size="2x"
          />
        )}
        {header && (
          <GIContainer className="modal0-header">{header}</GIContainer>
        )}
        {body}
        {footer && (
          <GIContainer className="modal0-footer">{footer}</GIContainer>
        )}
        {children}
      </GIContainer>
    );
  }
}

export default Modal0;
