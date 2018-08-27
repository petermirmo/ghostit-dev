import React, { Component } from "react";
import "./styles/";

class ConfirmAlert extends Component {
  componentDidMount = () => {
    document.addEventListener("keydown", this.handleKeyPress, false);
  };
  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleKeyPress, false);
  };
  handleKeyPress = event => {
    if (event.keyCode === 27) {
      // escape button pushed
      this.props.close();
    }
  };
  render() {
    let firstButton = "Delete";
    let firstButtonStyle = "confirm-button";
    let secondButtonStyle = "cancel-button";
    if (this.props.type) {
      if (this.props.type === "modify") {
        firstButton = "Modify";
        firstButtonStyle = "cancel-button";
        secondButtonStyle = "confirm-button";
      } else if (this.props.type === "change-post") {
        firstButton = "Discard";
      }
    }
    return (
      <div className="confirm-alert-background" onClick={this.props.close}>
        <div className="confirm-alert" onClick={e => e.stopPropagation()}>
          <div className="confirm-title">{this.props.title}</div>
          <div className="confirm-message">{this.props.message}</div>
          <div className="options-container">
            <button onClick={() => this.props.callback(true)} className={firstButtonStyle}>
							{firstButton}
						</button>
						<button onClick={() => this.props.callback(false)} className={secondButtonStyle}>
							Cancel
						</button>
          </div>
        </div>
      </div>
    );
  }
}
export default ConfirmAlert;
