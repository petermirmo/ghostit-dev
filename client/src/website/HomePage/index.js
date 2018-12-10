import React, { Component } from "react";
import { Link } from "react-router-dom";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateAccounts } from "../../redux/actions/";

import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
import Section5 from "./Section5";

import Ghost from "./Ghost";
import GhostSpeakingMessage from "./GhostSpeakingMessage";

import "./style.css";

class HomePage extends Component {
  state = {
    displayGhostAndMessage: false
  };
  componentDidMount() {
    this._ismounted = true;
    this.props.updateAccounts([
      {
        socialType: "facebook",
        accountType: "page",
        username: "Facebook Page",
        _id: "1234"
      }
    ]);
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
        <Section4 />
        <Section5 />
        <div className="ghost-container fixed flex">
          {displayGhostAndMessage && (
            <FontAwesomeIcon
              onClick={() => this.setState({ displayGhostAndMessage: false })}
              className="close fixed top right"
              icon={faTimes}
            />
          )}

          {displayGhostAndMessage && (
            <Link to="/sign-up">
              <GhostSpeakingMessage message="Ready to start your free trial?" />
            </Link>
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
      updateAccounts
    },
    dispatch
  );
}
export default connect(
  null,
  mapDispatchToProps
)(HomePage);