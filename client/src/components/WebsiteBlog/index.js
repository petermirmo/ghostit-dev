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
          <button className="round-button">bold</button>
          <button className="round-button">italic</button>
          <button className="round-button">underline</button>
          <button className="round-button">h1</button>
          <button className="round-button">h2</button>
          <button className="round-button">h3</button>
          <button className="round-button">h4</button>
          <button className="round-button">h5</button>
          <button className="round-button">h6</button>
        </div>
      </div>
    );
  }
}

export default WebsiteBlog;
