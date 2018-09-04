import React, { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setKeyListenerFunction } from "../../redux/actions/";

import "./styles/";

class OptionModal extends Component {
  componentDidMount() {
    this._ismounted = true;

    this.props.setKeyListenerFunction([
      event => {
        if (!this._ismounted) return;
        if (event.keyCode === 27) {
          this.props.handleChange(false, "optionModal"); // escape button pushed
        }
      },
      this.props.getKeyListenerFunction[0]
    ]);
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <div
        className="modal"
        onClick={() => this.props.handleChange(false, "optionModal")}
      >
        <div className="option-container">
          <div
            className="option1"
            onClick={e => {
              e.stopPropagation();
              this.props.handleChange(true, "recipeModal");
              this.props.handleChange(false, "optionModal");
            }}
          >
            Create a Campaign
          </div>
          <div
            className="option2"
            onClick={e => {
              e.stopPropagation();
              this.props.handleChange(true, "contentModal");
              this.props.handleChange(false, "optionModal");
            }}
          >
            Create a single post
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
)(OptionModal);
