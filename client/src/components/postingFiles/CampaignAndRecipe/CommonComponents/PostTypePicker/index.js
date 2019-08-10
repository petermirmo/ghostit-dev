import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getPostColor, getPostIcon } from "../../../../../componentFunctions";

import GIContainer from "../../../../containers/GIContainer";

class PostTypePicker extends Component {
  render() {
    const { newPost } = this.props;
    return (
      <GIContainer className="x-fill x-wrap justify-center pb64">
        <GIContainer className="grid-4-columns">
          <button
            className="flex column fill-flex full-center white py16 px32 mt8 mx4 br4"
            onClick={() => newPost("facebook")}
            style={{
              backgroundColor: getPostColor("facebook")
            }}
          >
            <FontAwesomeIcon icon={getPostIcon("facebook")} size="2x" />
            Facebook
          </button>
          <button
            className="flex column fill-flex full-center white py16 px32 mt8 mx4 br4"
            onClick={() => newPost("twitter")}
            style={{
              backgroundColor: getPostColor("twitter")
            }}
          >
            <FontAwesomeIcon icon={getPostIcon("twitter")} size="2x" />
            Twitter
          </button>
          <button
            className="flex column fill-flex full-center white py16 px32 mt8 mx4 br4"
            onClick={() => newPost("linkedin")}
            style={{
              backgroundColor: getPostColor("linkedin")
            }}
          >
            <FontAwesomeIcon icon={getPostIcon("linkedin")} size="2x" />
            LinkedIn
          </button>
          <button
            className="flex column fill-flex full-center white py16 px32 mt8 mx4 br4"
            onClick={() => newPost("custom")}
            style={{
              backgroundColor: getPostColor("custom")
            }}
          >
            Other
          </button>
        </GIContainer>
      </GIContainer>
    );
  }
}

export default PostTypePicker;
