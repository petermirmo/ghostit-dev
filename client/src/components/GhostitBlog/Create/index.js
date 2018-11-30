import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";

import ViewWebsiteBlog from "../View";

import "./styles";

class CreateWebsiteBlog extends Component {
  state = {
    contentArray: [],
    viewBlogPreview: false
  };
  componentDidMount() {
    this.addNewTextBox();
  }
  addNewTextBox = () => {
    let { contentArray } = this.state;
    contentArray.push({
      text: "",
      bold: false,
      italic: false,
      underline: false,
      type: "p",
      position: "left"
    });
    this.setState({ contentArray });
  };
  handleContentChange = (value, index, index2) => {
    let { contentArray } = this.state;
    contentArray[index][index2] = value;
    this.setState({ contentArray });
  };
  render() {
    const { contentArray, viewBlogPreview } = this.state;

    if (viewBlogPreview) {
      return (
        <div className="border-box flex column ma32">
          <ViewWebsiteBlog contentArray={contentArray} />
          <button
            onClick={() => this.setState({ viewBlogPreview: false })}
            className="regular-button"
          >
            Back to Editing
          </button>
        </div>
      );
    }

    return (
      <div className="border-box flex column ma32">
        {contentArray.map((textObj, index) => {
          return (
            <div key={"text" + index} className="relative mt32">
              <div className="text-options">
                <button
                  className={
                    textObj.bold ? "plain-button active" : "plain-button"
                  }
                  onClick={() =>
                    this.handleContentChange(!textObj.bold, index, "bold")
                  }
                >
                  bold
                </button>
                <button
                  className={
                    textObj.italic ? "plain-button active" : "plain-button"
                  }
                  onClick={() =>
                    this.handleContentChange(!textObj.italic, index, "italic")
                  }
                >
                  italic
                </button>
                <button
                  className={
                    textObj.underline ? "plain-button active" : "plain-button"
                  }
                  onClick={() =>
                    this.handleContentChange(
                      !textObj.underline,
                      index,
                      "underline"
                    )
                  }
                >
                  underline
                </button>
                <button
                  className={
                    textObj.type === "p"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("p", index, "type")}
                >
                  p
                </button>
                <button
                  className={
                    textObj.type === "h1"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h1", index, "type")}
                >
                  h1
                </button>
                <button
                  className={
                    textObj.type === "h2"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h2", index, "type")}
                >
                  h2
                </button>
                <button
                  className={
                    textObj.type === "h3"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h3", index, "type")}
                >
                  h3
                </button>
                <button
                  className={
                    textObj.type === "h4"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h4", index, "type")}
                >
                  h4
                </button>
                <button
                  className={
                    textObj.type === "h5"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h5", index, "type")}
                >
                  h5
                </button>
                <button
                  className={
                    textObj.type === "h6"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h6", index, "type")}
                >
                  h6
                </button>
                <button
                  className={
                    textObj.position === "left"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() =>
                    this.handleContentChange("left", index, "position")
                  }
                >
                  left
                </button>
                <button
                  className={
                    textObj.position === "center"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() =>
                    this.handleContentChange("center", index, "position")
                  }
                >
                  center
                </button>
                <button
                  className={
                    textObj.position === "right"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() =>
                    this.handleContentChange("right", index, "position")
                  }
                >
                  right
                </button>
              </div>
              <textarea
                className="text-container width100"
                placeholder="Tell me something"
                onChange={e =>
                  this.handleContentChange(e.target.value, index, "text")
                }
                value={textObj.text}
              />
            </div>
          );
        })}
        <FontAwesomeIcon
          onClick={this.addNewTextBox}
          className="round-icon-button button round pa8 common-shadow"
          icon={faPlus}
          size="2x"
        />
        <button
          onClick={() => this.setState({ viewBlogPreview: true })}
          className="regular-button mt8"
        >
          View Preview
        </button>
      </div>
    );
  }
}

export default CreateWebsiteBlog;
