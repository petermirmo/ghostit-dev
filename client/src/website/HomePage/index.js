import React, { Component } from "react";

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
    setInterval(() => {
      const { displayGhostAndMessage } = this.state;
      this.setState({ displayGhostAndMessage: !displayGhostAndMessage });
    }, 12000);
  }
  render() {
    const { displayGhostAndMessage } = this.state;
    return (
      <div>
        <Section1 />
        <Section2 />
        <Section3 />
        {displayGhostAndMessage && (
          <div className="ghost-container fixed flex">
            <GhostSpeakingMessage message="Ready to start your free trial?" />
            <Ghost />
          </div>
        )}
      </div>
    );
  }
}

export default HomePage;
