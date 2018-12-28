import React, { Component } from "react";
import axios from "axios";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faImage,
  faFont
} from "@fortawesome/fontawesome-free-solid";

import ContentEditable from "react-contenteditable";

import { Link, withRouter } from "react-router-dom";

import ViewWebsiteBlog from "../View";

import "./style.css";

class CreateWebsiteBlog extends Component {
  state = {
    url: "",
    locationCounter: 0,
    id: undefined,
    category: 0,
    deleteImageArray: [],
    contentArray: [],
    hyperlink: "",
    images: []
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
              url: ghostitBlog.url,
              images: ghostitBlog.images,
              category: ghostitBlog.category,
              contentArray: ghostitBlog.contentArray,
              locationCounter:
                ghostitBlog.images.length + ghostitBlog.contentArray.length
            });
          }
        }
      });
    } else {
      this.insertTextbox();
    }
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
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
    const { contentArray, locationCounter } = this.state;
    contentArray.splice(index, 1);
    this.setState({ contentArray });
  };
  removeImage = index => {
    let { images, deleteImageArray } = this.state;
    if (images[index].url) deleteImageArray.push(images[index].publicID);
    images.splice(index, 1);
    this.setState({ images, deleteImageArray });
  };
  insertTextbox = location => {
    let { contentArray, locationCounter, images } = this.state;

    if (!isNaN(location)) {
      let index = 0;

      contentArray.splice(index, 0, {
        html: "<p>Start Writing!</p>",
        location: location + 1
      });
      for (let i = index + 1; i < contentArray.length; i++) {
        contentArray[i].location++;
      }
    } else {
      contentArray.push({
        html: "<p>Start Writing!</p>",
        location: locationCounter
      });
    }

    locationCounter++;
    this.setState({ contentArray, locationCounter, images });
  };
  insertImage = (event, index) => {
    let newImages = event.target.files;

    let { images, locationCounter } = this.state;

    // Save each image to state
    for (let index2 = 0; index2 < newImages.length; index2++) {
      let reader = new FileReader();
      let image = newImages[index2];

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
        const { success, ghostitBlog } = res.data;
        if (success) {
          if (!id) {
            this.props.history.push("/manage/" + ghostitBlog._id);
            this.setState({ id: ghostitBlog._id });
            alert("Successfully saved Ghostit blog.");
          } else alert("Successfully saved Ghostit blog.");
        } else console.log(res.data);
      });
  };
  createRelevantImageDiv = (image, index) => {
    return (
      <div
        className="common-container-center my32"
        key={"image" + index}
        id="ghostit-blog-img-container"
      >
        <div
          className="hover-options-container"
          style={{
            backgroundColor: "var(--five-primary-color)"
          }}
        >
          <button onClick={() => this.handleImageChange("tiny", index, "size")}>
            tiny
          </button>
          <button
            onClick={() => this.handleImageChange("small", index, "size")}
          >
            small
          </button>
          <button
            onClick={() => this.handleImageChange("medium", index, "size")}
          >
            medium
          </button>
          <button
            onClick={() => this.handleImageChange("large", index, "size")}
          >
            large
          </button>
        </div>
        <div className="top-right-over-div">
          <FontAwesomeIcon
            icon={faTrash}
            className="delete"
            onClick={() => this.removeImage(index)}
          />
          <FontAwesomeIcon
            icon={faImage}
            className="icon-regular-button my8"
            onClick={event => this.insertImage(event, image.location)}
          />
          <FontAwesomeIcon
            icon={faFont}
            className="icon-regular-button"
            onClick={() => this.insertTextbox(image.location)}
          />
        </div>
        <img
          src={image.imagePreviewUrl || image.url}
          className={"image br4 " + image.size}
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

  editableTextbox = (index, content) => {
    return (
      <div
        key={"jsk" + index}
        className="relative"
        id="editable-text-container"
      >
        <ContentEditable
          innerRef={this.contentEditable}
          html={content.html}
          disabled={false}
          onChange={e =>
            this.handleContentChange(e.target.value, index, "html")
          }
          className="simple-container medium pa4"
        />
        <div className="top-right-over-div">
          <FontAwesomeIcon
            icon={faTrash}
            className="delete"
            onClick={() => this.removeTextarea(index)}
          />
          <FontAwesomeIcon
            icon={faImage}
            className="icon-regular-button my8"
            onClick={event => this.insertImage(event, content.location)}
          />
          <FontAwesomeIcon
            icon={faFont}
            className="icon-regular-button"
            onClick={() => this.insertTextbox(content.location)}
          />
        </div>
      </div>
    );
  };

  render() {
    const { url, category, hyperlink, contentArray, images } = this.state;
    console.log(contentArray);
    let blogDivs = [];

    let imageCounter = 0;
    let contentCounter = 0;
    for (let index = 0; index < contentArray.length + images.length; index++) {
      let content = contentArray[contentCounter];
      let image = images[imageCounter];
      if (content && image) {
        if (image.location > content.location) {
          blogDivs.push(this.editableTextbox(contentCounter, content));
          contentCounter += 1;
        } else {
          blogDivs.push(this.createRelevantImageDiv(image, imageCounter));
          imageCounter += 1;
        }
      } else if (image) {
        blogDivs.push(this.createRelevantImageDiv(image, imageCounter));
        imageCounter += 1;
      } else {
        blogDivs.push(this.editableTextbox(contentCounter, content));
        contentCounter += 1;
      }
    }

    return (
      <div className="common-container-center pb32 mb32">
        <div className="flex my8">
          <p className="label mr8">Blog URL:</p>
          <input
            type="text"
            onChange={e => this.setState({ url: e.target.value })}
            value={url}
            className="regular-input"
            placeholder="10-marketing-strategies"
          />
          <p className="label mx8">Category: (number)</p>
          <input
            className="regular-input"
            type="number"
            value={category}
            onChange={e => this.setState({ category: e.target.value })}
          />
        </div>

        {blogDivs}

        <div
          className="wrapping-container common-shadow"
          id="ghostit-blog-text-styling"
        >
          <EditButton cmd="undo" />
          <EditButton cmd="italic" />
          <EditButton cmd="bold" />
          <EditButton cmd="underline" />
          <EditButton cmd="justifyLeft" name="Left" />
          <EditButton cmd="justifyCenter" name="Center" />
          <EditButton cmd="justifyRight" name="Right" />
          <EditButton cmd="formatBlock" arg="p" name="p" />
          <EditButton cmd="formatBlock" arg="h1" name="h1" />
          <EditButton cmd="formatBlock" arg="h2" name="h2" />
          <EditButton cmd="formatBlock" arg="h3" name="h3" />
          <EditButton cmd="formatBlock" arg="h4" name="h4" />
          <EditButton cmd="formatBlock" arg="h5" name="h5" />
          <EditButton cmd="formatBlock" arg="h6" name="h6" />
          <EditButton cmd="unlink" arg={hyperlink} name="Unlink" />
          <EditButton cmd="createLink" arg={hyperlink} name="Link" />
          <input
            type="text"
            onChange={e => this.setState({ hyperlink: e.target.value })}
            value={hyperlink}
            className="regular-input br0"
            placeholder="Type your hyperlink value here"
          />
          <EditButton cmd="insertParagraph" name="Insert new Paragraph" />
          <EditButton cmd="removeFormat" name="Clear formatting" />
        </div>

        <div className="flex my16">
          <label htmlFor="file-upload2" className="regular-button mr8">
            Insert Image
          </label>
          <input
            id="file-upload2"
            type="file"
            onChange={event => this.insertImage(event)}
          />
          <button
            className="regular-button ml8"
            onClick={() => this.insertTextbox()}
          >
            Insert Textbox
          </button>
        </div>

        <button onClick={this.saveGhostitBlog} className="regular-button">
          Save Ghostit Blog
        </button>
      </div>
    );
  }
}

// Taken from https://codesandbox.io/s/l91xvkox9l
function EditButton(props) {
  return (
    <button
      key={props.cmd}
      onMouseDown={e => {
        e.preventDefault(); // Avoids loosing focus from the editable area
        document.execCommand(props.cmd, false, props.arg); // Send the command to the browser
      }}
      className="plain-button"
    >
      {props.name || props.cmd}
    </button>
  );
}
function ghostitBlogImagesCompare(a, b) {
  if (a.location < b.location) return -1;
  if (a.location > b.location) return 1;
  return 0;
}

export default withRouter(CreateWebsiteBlog);
