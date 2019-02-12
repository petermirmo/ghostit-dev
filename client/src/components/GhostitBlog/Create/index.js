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
    id: undefined,
    category: 0,
    deleteImageArray: [],
    contentArray: [],
    hyperlink: ""
  };
  componentDidMount() {
    this._ismounted = true;
    if (this.props.id) {
      axios.get("/api/ghostit/blog/" + this.props.id).then(res => {
        const { ghostitBlog } = res.data;

        if (ghostitBlog) {
          const contentArray = [];
          if (ghostitBlog.images)
            for (let i = 0; i < ghostitBlog.images.length; i++) {
              const image = ghostitBlog.images[i];
              contentArray[image.location] = image;
            }
          if (ghostitBlog.contentArray)
            for (let i = 0; i < ghostitBlog.contentArray.length; i++) {
              const content = ghostitBlog.contentArray[i];
              contentArray[content.location] = content;
            }

          if (this._ismounted) {
            this.setState({
              id: ghostitBlog._id,
              url: ghostitBlog.url,
              category: ghostitBlog.category,
              contentArray
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

  removeIndex = index => {
    const { contentArray, deleteImageArray } = this.state;
    if (contentArray[index].url) deleteImageArray.push(images[index].publicID);
    contentArray.splice(index, 1);
    this.setState({ contentArray, deleteImageArray });
  };
  insertTextbox = location => {
    location += 1;
    let { contentArray } = this.state;

    contentArray.splice(location, 0, {
      html: "<p>Start Writing!</p>"
    });

    this.setState({ contentArray });
  };
  insertImage = (event, location) => {
    let newImages = event.target.files;
    location += 1;
    let { contentArray } = this.state;

    // Save each image to state
    for (let index = 0; index < newImages.length; index++) {
      let reader = new FileReader();
      let image = newImages[index];

      reader.onloadend = image => {
        contentArray.splice(location + index, 0, {
          size: "small",
          image,
          imagePreviewUrl: reader.result,
          alt: ""
        });

        this.setState({ contentArray });
      };
      reader.readAsDataURL(image);
    }
  };
  saveGhostitBlog = () => {
    let { contentArray, url, id, category, deleteImageArray } = this.state;

    if (!url) {
      alert("Add url!");
      return;
    }
    alert("saving");
    axios
      .post("/api/ghostit/blog", {
        contentArray,
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
          <button
            onClick={() => this.handleContentChange("tiny", index, "size")}
          >
            tiny
          </button>
          <button
            onClick={() => this.handleContentChange("small", index, "size")}
          >
            small
          </button>
          <button
            onClick={() => this.handleContentChange("medium", index, "size")}
          >
            medium
          </button>
          <button
            onClick={() => this.handleContentChange("large", index, "size")}
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

          <label htmlFor={"image-file-upload" + index}>
            <FontAwesomeIcon
              icon={faImage}
              className="icon-regular-button my8"
            />
          </label>
          <input
            id={"image-file-upload" + index}
            type="file"
            onChange={event => {
              this.insertImage(event, index);
            }}
          />
          <FontAwesomeIcon
            icon={faFont}
            className="icon-regular-button"
            onClick={() => this.insertTextbox(index)}
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
          onChange={e => this.handleContentChange(e.target.value, index, "alt")}
        />
      </div>
    );
  };

  editableTextbox = (content, index) => {
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
          <label htmlFor={"text-file-upload" + index}>
            <FontAwesomeIcon
              icon={faImage}
              className="icon-regular-button my8"
            />
          </label>
          <input
            id={"text-file-upload" + index}
            type="file"
            onChange={event => this.insertImage(event, index)}
          />
          <FontAwesomeIcon
            icon={faFont}
            className="icon-regular-button"
            onClick={() => this.insertTextbox(index)}
          />
        </div>
      </div>
    );
  };

  render() {
    const { url, category, hyperlink, contentArray } = this.state;
    const blogDivs = [];

    for (let index = 0; index < contentArray.length; index++) {
      const content = contentArray[index];
      if (content.size) {
        blogDivs.push(this.createRelevantImageDiv(content, index));
      } else {
        blogDivs.push(this.editableTextbox(content, index));
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
          <label htmlFor="file-upload3" className="regular-button mr8">
            Insert Image
          </label>
          <input
            id="file-upload3"
            type="file"
            onChange={event => this.insertImage(event, contentArray.length - 1)}
          />
          <button
            className="regular-button ml8"
            onClick={() => this.insertTextbox(contentArray.length - 1)}
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

export default withRouter(CreateWebsiteBlog);
