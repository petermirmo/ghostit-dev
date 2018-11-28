import React, { Component } from "react";

import "./styles";

class WebsiteBlog extends Component {
  state = {
    something: [],
    someText: ""
  };
  render() {
    return (
      <div className="relative border-box flex ma32">
        <textarea
          className="text-container width100"
          placeholder="Tell me something"
        />
        <div className="text-options">
          <button className="plain-button">bold</button>
          <button className="plain-button">italic</button>
          <button className="plain-button">underline</button>
          <button className="plain-button">h1</button>
          <button className="plain-button">h2</button>
          <button className="plain-button">h3</button>
          <button className="plain-button">h4</button>
          <button className="plain-button">h5</button>
          <button className="plain-button">left</button>
          <button className="plain-button">center</button>
          <button className="plain-button">right</button>
        </div>
      </div>
    );
  }
}

export default WebsiteBlog;
