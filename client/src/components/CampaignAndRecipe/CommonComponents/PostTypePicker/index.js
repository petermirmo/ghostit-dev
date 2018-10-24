import React, { Component } from "react";

import "./styles/";

class PostTypePicker extends Component {
  render() {
    return (
      <div className="new-post-prompt flex mt16">
        <div
          className="account-option br4 pa8 mr4 button"
          onClick={() => this.props.newPost("facebook")}
        >
          Facebook<br />Post
        </div>
        <div
          className="account-option br4 pa8 mr4 button"
          onClick={() => this.props.newPost("twitter")}
        >
          Twitter<br />Post
        </div>
        <div
          className="account-option br4 pa8 mr4 button"
          onClick={() => this.props.newPost("linkedin")}
        >
          LinkedIn<br />Post
        </div>
        <div
          className="account-option br4 pa8 mr4 button"
          onClick={() => this.props.newPost("custom")}
        >
          Custom<br />Task
        </div>
      </div>
    );
  }
}

export default PostTypePicker;
