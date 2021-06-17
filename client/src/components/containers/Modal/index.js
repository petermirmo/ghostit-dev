import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

import GIContainer from "../GIContainer";

import "./style.css";

class Modal extends Component {
  render() {
    const {
      body,
      className,
      footer,
      header,
      showClose = true,
      style
    } = this.props; // Variables
    const { close } = this.props; // Functions
    return (
      <GIContainer className="modal full-center" onClick={close}>
        <GIContainer
          className={`modal-content ${className}`}
          onClick={e => e.stopPropagation()}
          style={style ? style : { maxHeight: "80vh", minHeight: "80vh" }}
        >
          {showClose && (
            <FontAwesomeIcon
              icon={faTimes}
              size="2x"
              className="close"
              onClick={close}
            />
          )}
          {header && (
            <GIContainer className="modal-header">{header}</GIContainer>
          )}
          <GIContainer className="modal-body">{body}</GIContainer>
          {footer && (
            <GIContainer className="modal-footer">{footer}</GIContainer>
          )}
        </GIContainer>
      </GIContainer>
    );
  }
}

export default Modal;
