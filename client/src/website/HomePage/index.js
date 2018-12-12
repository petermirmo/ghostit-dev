import React, { Component } from "react";
import { Link } from "react-router-dom";
import MetaTags from "react-meta-tags";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

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
        <MetaTags>
          <title>All-In-One Marketing Solution</title>
          <meta
            name="description"
            content="Organize your marketing process with an all-in-one solution for unified content promotion."
          />
        </MetaTags>
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

export default HomePage;
