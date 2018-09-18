import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../../redux/actions/";

import "./styles/";

class ConfirmAlert extends Component {
  state = {
    checked: false
  };
  componentDidMount = () => {
    this._ismounted = true;

    let { getKeyListenerFunction, setKeyListenerFunction } = this.props;

    this.props.setKeyListenerFunction([
      event => {
        if (!this._ismounted) return;
        if (event.keyCode === 27) {
          this.props.close(); // escape button pushed
        }
      },
      getKeyListenerFunction[0]
    ]);
  };
  componentWillUnmount = () => {
    this._ismounted = false;

    this.props.setKeyListenerFunction([
      this.props.getKeyListenerFunction[1],
      this.props.getKeyListenerFunction[0]
    ]);
  };

  render() {
    const { checked } = this.state;
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
      } // else "delete-campaign" or "delete-post"
    }
    return (
      <div className="confirm-alert-background" onClick={this.props.close}>
        <div className="confirm-alert" onClick={e => e.stopPropagation()}>
          <div className="confirm-title">{this.props.title}</div>
          <div className="confirm-message">{this.props.message}</div>
          <div className="options-container">
            <button
              onClick={() => this.props.callback(true, checked)}
              className={firstButtonStyle}
            >
              {firstButton}
            </button>
            <button
              onClick={() => this.props.callback(false, checked)}
              className={secondButtonStyle}
            >
              Cancel
            </button>
          </div>
          <div
            className="checkbox-option"
            onClick={() => {
              this.setState({ checked: !checked });
            }}
          >
            <input type="checkbox" checked={checked} />
            Don't ask me again.
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    getKeyListenerFunction: state.getKeyListenerFunction
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setKeyListenerFunction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmAlert);
