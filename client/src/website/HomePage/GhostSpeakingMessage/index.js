import React, { Component } from "react";

import "./style.css";

class GhostSpeakingMessage extends Component {
  render() {
    const { message } = this.props;
    return (
      <div className="message-container pa32 br8 button">
        <h4 className="silly-font">{message}</h4>
      </div>
    );
  }
}

export default GhostSpeakingMessage;
