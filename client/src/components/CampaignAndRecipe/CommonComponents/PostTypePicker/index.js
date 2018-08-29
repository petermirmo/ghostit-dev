import React, { Component } from "react";

import "./styles/";

class PostTypePicker extends Component {
  render() {
    return (
      <div className="new-post-prompt">
        <div
          className="account-option"
          onClick={() => this.props.newPost("facebook")}
        >
          Facebook<br />Post
        </div>
        <div
          className="account-option"
          onClick={() => this.props.newPost("twitter")}
        >
          Twitter<br />Post
        </div>
        <div
          className="account-option"
          onClick={() => this.props.newPost("linkedin")}
        >
          LinkedIn<br />Post
        </div>
        <div
          className="account-option"
          onClick={() => this.props.newPost("custom")}
        >
          Custom<br />Task
        </div>
      </div>
    );
  }
}

export default PostTypePicker;
