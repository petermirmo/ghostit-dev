import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faTrash from "@fortawesome/fontawesome-free-solid/faTrash";

import ViewWebsiteBlog from "../View";

import "./style.css";

class CreateWebsiteBlog extends Component {
  state = {
    contentArray: [],
    images: [],
    url: "",
    viewBlogPreview: false,
    locationCounter: 0,
    id: undefined,
    category: 0,
    deleteImageArray: []
  };
  componentDidMount() {
    this._ismounted = true;
    if (this.props.id) {
      axios.get("/api/ghostit/blog/" + this.props.id).then(res => {
        const { ghostitBlog } = res.data;

        if (ghostitBlog) {
          ghostitBlog.images.sort(ghostitBlogImagesCompare);
          if (this._ismounted) {
            this.setState({
              id: ghostitBlog._id,
              contentArray: ghostitBlog.contentArray,
              url: ghostitBlog.url,
              images: ghostitBlog.images,
              locationCounter:
                ghostitBlog.images.length + ghostitBlog.contentArray.length - 1
            });
          }
        }
      });
    }
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  insertImage = event => {
    let newImages = event.target.files;

    let { images, locationCounter } = this.state;

    // Save each image to state
    for (let index = 0; index < newImages.length; index++) {
      let reader = new FileReader();
      let image = newImages[index];

      reader.onloadend = image => {
        images.push({
          size: "small",
          image,
          imagePreviewUrl: reader.result,
          location: locationCounter,
          alt: ""
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
      location: locationCounter,
      link: ""
    });
    locationCounter += 1;
    this.setState({ contentArray, locationCounter });
  };
  handleContentChange = (value, index, index2) => {
    let { contentArray } = this.state;
    contentArray[index][index2] = value;
    this.setState({ contentArray });
  };
  handleImageChange = (value, index, index2) => {
    let { images } = this.state;
    images[index][index2] = value;
    this.setState({ images });
  };
  removeTextarea = index => {
    let { contentArray } = this.state;
    contentArray.splice(index, 1);
    this.setState({ contentArray });
  };
  removeImage = index => {
    let { images, deleteImageArray } = this.state;
    if (images[index].url) deleteImageArray.push(images[index].publicID);
    images.splice(index, 1);
    this.setState({ images, deleteImageArray });
  };
  saveGhostitBlog = () => {
    let {
      contentArray,
      images,
      url,
      id,
      category,
      deleteImageArray
    } = this.state;

    if (!url) {
      alert("Add url!");
      return;
    }
    alert("saving");
    axios
      .post("/api/ghostit/blog", {
        contentArray,
        images,
        url,
        id,
        category,
        deleteImageArray
      })
      .then(res => {
        if (res.data.success) alert("Successfully saved Ghostit blog.");
        else console.log(res.data);
      });
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
        <div className="hover-options-container">
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
              content.type === "a" ? "plain-button active" : "plain-button"
            }
            onClick={() => this.handleContentChange("a", index, "type")}
          >
            a
          </button>
          <button
            className={
              content.type === "span" ? "plain-button active" : "plain-button"
            }
            onClick={() => this.handleContentChange("span", index, "type")}
          >
            span
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
        <FontAwesomeIcon
          icon={faTrash}
          className="delete absolute bottom right"
          onClick={() => this.removeTextarea(index)}
        />
        {content.type === "a" && (
          <input
            className="regular-input width100 border-box"
            value={content.link}
            placeholder="link"
            onChange={e =>
              this.handleContentChange(e.target.value, index, "link")
            }
          />
        )}
      </div>
    );
  };
  createRelevantImageDiv = (image, index) => {
    return (
      <div
        className="relative my32 margin-hc flex column hc vc"
        key={"image" + index}
      >
        <div className="hover-options-container">
          <button
            className="plain-button"
            onClick={() => this.handleImageChange("tiny", index, "size")}
          >
            tiny
          </button>
          <button
            className="plain-button"
            onClick={() => this.handleImageChange("small", index, "size")}
          >
            small
          </button>
          <button
            className="plain-button"
            onClick={() => this.handleImageChange("medium", index, "size")}
          >
            medium
          </button>
          <button
            className="plain-button"
            onClick={() => this.handleImageChange("large", index, "size")}
          >
            large
          </button>
        </div>
        <img
          src={image.imagePreviewUrl || image.url}
          className={"image " + image.size}
        />
        <FontAwesomeIcon
          icon={faTrash}
          className="delete absolute bottom right"
          onClick={() => this.removeImage(index)}
        />
        <input
          className="regular-input width100 border-box"
          value={image.alt ? image.alt : ""}
          placeholder="alt"
          onChange={e => this.handleImageChange(e.target.value, index, "alt")}
        />
      </div>
    );
  };

  render() {
    const { contentArray, viewBlogPreview, url, images, category } = this.state;

    if (viewBlogPreview) {
      return (
        <div className="website-page simple-container">
          <ViewWebsiteBlog contentArray={contentArray} images={images} />
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
          divs.push(this.textareaDiv(content, contentCounter));
          contentCounter += 1;
        } else {
          divs.push(this.createRelevantImageDiv(image, imageCounter));
          imageCounter += 1;
        }
      } else if (image) {
        divs.push(this.createRelevantImageDiv(image, imageCounter));
        imageCounter += 1;
      } else {
        divs.push(this.textareaDiv(content, contentCounter));
        contentCounter += 1;
      }
    }

    return (
      <div className="border-box flex column">
        <div className="flex mx20vw mt8">
          <p className="label mr8">Blog URL:</p>
          <input
            type="text"
            onChange={e => this.setState({ url: e.target.value })}
            value={url}
            className="regular-input"
            placeholder="10-marketing-strategies"
          />
        </div>
        <div className="flex mx20vw mt8">
          <p className="label mr8">Category: (number)</p>
          <input
            className="regular-input"
            type="number"
            value={category}
            onChange={e => this.setState({ category: e.target.value })}
          />
        </div>

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
function ghostitBlogImagesCompare(a, b) {
  if (a.location < b.location) return -1;
  if (a.location > b.location) return 1;
  return 0;
}

export default CreateWebsiteBlog;
