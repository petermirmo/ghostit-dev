import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faImages from "@fortawesome/fontawesome-free-solid/faImages";

import ViewWebsiteBlog from "../View";

import "./styles";

class CreateWebsiteBlog extends Component {
  state = {
    contentArray: [],
    images: [],
    blogUrl: "",
    viewBlogPreview: false,
    locationCounter: 0
  };
  componentDidMount() {
    window.onkeyup = e => {
      let key = e.keyCode ? e.keyCode : e.which;

      if (key == 13) {
      }
    };
    this.addNewTextBox();
  }
  addCoverImage = event => {
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
  };
  insertImage = event => {
    let test = event.target.files;

    let { images, locationCounter } = this.state;

    // Save each image to state
    for (let index = 0; index < test.length; index++) {
      let reader = new FileReader();
      let image = test[index];

      reader.onloadend = image => {
        images.push({
          size: "small",
          image,
          imagePreviewUrl: reader.result,
          location: locationCounter
        });
        locationCounter += 1;

        this.setState({ images, locationCounter });
      };

      reader.readAsDataURL(image);
    }
  };
  addNewTextBox = () => {
    let { contentArray, locationCounter } = this.state;
    contentArray.push({
      text: "",
      bold: false,
      italic: false,
      underline: false,
      type: "p",
      position: "left",
      location: locationCounter
    });
    locationCounter += 1;
    this.setState({ contentArray, locationCounter });
  };
  handleContentChange = (value, index, index2) => {
    let { contentArray } = this.state;
    contentArray[index][index2] = value;
    this.setState({ contentArray });
  };
  textareaDiv = (content, index) => {
    let style = {};

    if (content.bold) style.fontWeight = "bold";
    if (content.italic) style.fontStyle = "italic";
    if (content.underline) style.textDecoration = "underline";

    if (content.position === "left") style.textAlign = "left";
    else if (content.position === "center") style.textAlign = "center";
    else if (content.position === "right") style.textAlign = "right";

    return (
      <div key={"text" + index} className="relative my32 mx20vw">
        <div className="div-hover-options-container">
          <button
            className={content.bold ? "plain-button active" : "plain-button"}
            onClick={() =>
              this.handleContentChange(!content.bold, index, "bold")
            }
          >
            bold
          </button>
          <button
            className={content.italic ? "plain-button active" : "plain-button"}
            onClick={() =>
              this.handleContentChange(!content.italic, index, "italic")
            }
          >
            italic
          </button>
          <button
            className={
              content.underline ? "plain-button active" : "plain-button"
            }
            onClick={() =>
              this.handleContentChange(!content.underline, index, "underline")
            }
          >
            underline
          </button>
          <button
            className={
              content.type === "p" ? "plain-button active" : "plain-button"
            }
            onClick={() => this.handleContentChange("p", index, "type")}
          >
            p
          </button>
          <button
            className={
              content.type === "h1" ? "plain-button active" : "plain-button"
            }
            onClick={() => this.handleContentChange("h1", index, "type")}
          >
            h1
          </button>
          <button
            className={
              content.type === "h2" ? "plain-button active" : "plain-button"
            }
            onClick={() => this.handleContentChange("h2", index, "type")}
          >
            h2
          </button>
          <button
            className={
              content.type === "h3" ? "plain-button active" : "plain-button"
            }
            onClick={() => this.handleContentChange("h3", index, "type")}
          >
            h3
          </button>
          <button
            className={
              content.type === "h4" ? "plain-button active" : "plain-button"
            }
            onClick={() => this.handleContentChange("h4", index, "type")}
          >
            h4
          </button>
          <button
            className={
              content.type === "h5" ? "plain-button active" : "plain-button"
            }
            onClick={() => this.handleContentChange("h5", index, "type")}
          >
            h5
          </button>
          <button
            className={
              content.type === "h6" ? "plain-button active" : "plain-button"
            }
            onClick={() => this.handleContentChange("h6", index, "type")}
          >
            h6
          </button>
          <button
            className={
              content.position === "left"
                ? "plain-button active"
                : "plain-button"
            }
            onClick={() => this.handleContentChange("left", index, "position")}
          >
            left
          </button>
          <button
            className={
              content.position === "center"
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
              content.position === "right"
                ? "plain-button active"
                : "plain-button"
            }
            onClick={() => this.handleContentChange("right", index, "position")}
          >
            right
          </button>
        </div>
        <textarea
          style={style}
          className="text-container width100 border-box"
          placeholder="Tell me something"
          onChange={e =>
            this.handleContentChange(e.target.value, index, "text")
          }
          value={content.text}
        />
      </div>
    );
  };
  createRelevantImageDiv = (image, index) => {
    return (
      <img
        key={"image" + index}
        src={image.imagePreviewUrl}
        className={"image margin-hc image-options " + image.size}
      />
    );
  };

  render() {
    const {
      contentArray,
      viewBlogPreview,
      coverImage,
      blogUrl,
      images
    } = this.state;

    if (viewBlogPreview) {
      return (
        <div className="border-box flex column">
          <ViewWebsiteBlog
            contentArray={contentArray}
            coverImage={coverImage}
            images={images}
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
    let divs = [];

    let imageCounter = 0;
    let contentCounter = 0;

    for (let index = 0; index < contentArray.length + images.length; index++) {
      let content = contentArray[contentCounter];
      let image = images[imageCounter];
      if (content && image) {
        if (image.location > content.location) {
          divs.push(this.textareaDiv(content, index));
          contentCounter += 1;
        } else {
          divs.push(this.createRelevantImageDiv(image, index));
          imageCounter += 1;
        }
      } else if (image) {
        divs.push(this.createRelevantImageDiv(image, index));
        imageCounter += 1;
      } else {
        divs.push(this.textareaDiv(content, index));
        contentCounter += 1;
      }
    }

    return (
      <div className="border-box flex column">
        <div className="flex mx20vw">
          <p className="label mr8">Blog URL:</p>
          <input
            type="text"
            onChange={e => this.setState({ blogUrl: e.target.value })}
            value={blogUrl}
            className="regular-input"
            placeholder="10-marketing-strategies"
          />
        </div>
        <div className="flex my32 mx20vw">
          <label htmlFor="file-upload" className="simple-button pa16 width100">
            Upload Cover Image
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={event => this.addCoverImage(event)}
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
        {divs}

        <div className="margin-hc flex">
          <button onClick={this.addNewTextBox} className="regular-button mr8">
            Insert Text
          </button>
          <div className="flex">
            <label htmlFor="file-upload2" className="regular-button ml8">
              Insert Image
            </label>
            <input
              id="file-upload2"
              type="file"
              onChange={event => this.insertImage(event)}
            />
          </div>
        </div>
        <button
          onClick={() => this.setState({ viewBlogPreview: true })}
          className="regular-button my8 mx20vw"
        >
          View Preview
        </button>
        <button
          onClick={this.saveGhostitBlog}
          className="regular-button my8 mx20vw"
        >
          Save Ghostit Blog
        </button>
      </div>
    );
  }
}

export default CreateWebsiteBlog;
