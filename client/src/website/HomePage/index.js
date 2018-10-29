import React, { Component } from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage } from "../../redux/actions/";

import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";

import Ghost from "./Ghost";
import GhostSpeakingMessage from "./GhostSpeakingMessage";

import "./style.css";

class HomePage extends Component {
  state = {
    displayGhostAndMessage: false
  };
  componentDidMount() {
    this._ismounted = true;
    setTimeout(() => {
      if (this._ismounted) this.setState({ displayGhostAndMessage: true });
    }, 8000);
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  render() {
    const { displayGhostAndMessage } = this.state;
    return (
      <div>
        <Section1 />
        <Section2 />
        <Section3 />
        <div className="ghost-container fixed flex">
          {displayGhostAndMessage && (
            <FontAwesomeIcon
              onClick={() => this.setState({ displayGhostAndMessage: false })}
              className="close fixed top right"
              icon={faTimes}
            />
          )}

          {displayGhostAndMessage && (
            <GhostSpeakingMessage
              message="Ready to start your free trial?"
              onClick={() => this.props.changePage("sign-up")}
            />
          )}

          <Ghost
            style={{
              width: displayGhostAndMessage ? "100px" : "60px",
              cursor: displayGhostAndMessage ? "auto" : "pointer",
              pointerEvents: displayGhostAndMessage ? "none" : "auto"
            }}
            onClick={
              displayGhostAndMessage
                ? () => this.setState({ displayGhostAndMessage: true })
                : () => this.setState({ displayGhostAndMessage: true })
            }
          />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changePage
    },
    dispatch
  );
}
export default connect(
  null,
  mapDispatchToProps
)(HomePage);
