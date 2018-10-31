import React, { Component } from "react";

import "./style.css";

class GhostSpeakingMessage extends Component {
  render() {
    const { message, onClick } = this.props;
    return (
      <div className="message-container pa32 br8 button" onClick={onClick}>
        <h4 className="message silly-font">{message}</h4>
      </div>
    );
  }
}

export default GhostSpeakingMessage;
