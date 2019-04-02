import React, { Component } from "react";

import { getPostColor } from "../../../../../componentFunctions";

class PostTypePicker extends Component {
  render() {
    return (
      <div className="wrapping-container">
        <button
          className="regular-button mt8 mx4 flex1"
          onClick={() => this.props.newPost("facebook")}
          style={{ backgroundColor: getPostColor("facebook") }}
        >
          Facebook Post
        </button>
        <button
          className="regular-button mt8 mx4 flex1"
          onClick={() => this.props.newPost("twitter")}
          style={{ backgroundColor: getPostColor("twitter") }}
        >
          Twitter Post
        </button>
        <button
          className="regular-button mt8 mx4 flex1"
          onClick={() => this.props.newPost("linkedin")}
          style={{ backgroundColor: getPostColor("linkedin") }}
        >
          LinkedIn Post
        </button>
        <button
          className="regular-button mt8 mx4 flex1"
          onClick={() => this.props.newPost("custom")}
          style={{ backgroundColor: getPostColor("custom") }}
        >
          Custom Task
        </button>
      </div>
    );
  }
}

export default PostTypePicker;
