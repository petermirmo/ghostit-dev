import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faImages from "@fortawesome/fontawesome-free-solid/faImages";

import ViewWebsiteBlog from "../View";

import "./styles";

class CreateWebsiteBlog extends Component {
  state = {
    contentArray: [],
    url: "",
    title: "",
    viewBlogPreview: false
  };
  componentDidMount() {
    window.onkeyup = e => {
      let key = e.keyCode ? e.keyCode : e.which;

      if (key == 13) {
      }
    };
    this.addNewTextBox();
  }
  showImages(event) {
    let images = event.target.files;

    let temp = [];

    // Save each image to state
    for (let index = 0; index < images.length; index++) {
      let reader = new FileReader();
      let image = images[index];

      reader.onloadend = image =>
        this.setState({
          coverImage: {
            image,
            imagePreviewUrl: reader.result
          }
        });

      reader.readAsDataURL(image);
    }
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
    const { contentArray, viewBlogPreview, coverImage } = this.state;

    if (viewBlogPreview) {
      return (
        <div className="border-box flex column">
          <ViewWebsiteBlog
            contentArray={contentArray}
            coverImage={coverImage}
          />
          <button
            onClick={() => this.setState({ viewBlogPreview: false })}
            className="regular-button mx20vw my16"
          >
            Back to Editing
          </button>
        </div>
      );
    }

    return (
      <div className="border-box flex column mx20vw">
        <p className="label">Blog URL</p>
        <input
          type="text"
          onChange={e => this.setState({ blogUrl: e.target.value })}
        />
        <div className="flex my32">
          <label htmlFor="file-upload" className="simple-button pa16 width100">
            Upload Cover Image
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={event => this.showImages(event)}
            multiple
          />
        </div>
        {coverImage && (
          <div className="cover-image-container">
            <img
              src={coverImage.imagePreviewUrl}
              className="cover-image width100"
            />
          </div>
        )}
        {contentArray.map((divInformation, index) => {
          let style = {};

          if (divInformation.bold) style.fontWeight = "bold";
          if (divInformation.italic) style.fontStyle = "italic";
          if (divInformation.underline) style.textDecoration = "underline";

          if (divInformation.position === "left") style.textAlign = "left";
          else if (divInformation.position === "center")
            style.textAlign = "center";
          else if (divInformation.position === "right")
            style.textAlign = "right";

          return (
            <div key={"text" + index} className="relative my32">
              <div className="text-options">
                <button
                  className={
                    divInformation.bold ? "plain-button active" : "plain-button"
                  }
                  onClick={() =>
                    this.handleContentChange(
                      !divInformation.bold,
                      index,
                      "bold"
                    )
                  }
                >
                  bold
                </button>
                <button
                  className={
                    divInformation.italic
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() =>
                    this.handleContentChange(
                      !divInformation.italic,
                      index,
                      "italic"
                    )
                  }
                >
                  italic
                </button>
                <button
                  className={
                    divInformation.underline
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() =>
                    this.handleContentChange(
                      !divInformation.underline,
                      index,
                      "underline"
                    )
                  }
                >
                  underline
                </button>
                <button
                  className={
                    divInformation.type === "p"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("p", index, "type")}
                >
                  p
                </button>
                <button
                  className={
                    divInformation.type === "h1"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h1", index, "type")}
                >
                  h1
                </button>
                <button
                  className={
                    divInformation.type === "h2"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h2", index, "type")}
                >
                  h2
                </button>
                <button
                  className={
                    divInformation.type === "h3"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h3", index, "type")}
                >
                  h3
                </button>
                <button
                  className={
                    divInformation.type === "h4"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h4", index, "type")}
                >
                  h4
                </button>
                <button
                  className={
                    divInformation.type === "h5"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h5", index, "type")}
                >
                  h5
                </button>
                <button
                  className={
                    divInformation.type === "h6"
                      ? "plain-button active"
                      : "plain-button"
                  }
                  onClick={() => this.handleContentChange("h6", index, "type")}
                >
                  h6
                </button>
                <button
                  className={
                    divInformation.position === "left"
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
                    divInformation.position === "center"
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
                    divInformation.position === "right"
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
                style={style}
                className="text-container width100"
                placeholder="Tell me something"
                onChange={e =>
                  this.handleContentChange(e.target.value, index, "text")
                }
                value={divInformation.text}
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
          className="regular-button my8"
        >
          View Preview
        </button>
        <button onClick={this.saveGhostitBlog} className="regular-button my8">
          Save Ghostit Blog
        </button>
      </div>
    );
  }
}

export default CreateWebsiteBlog;
