import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { faFont } from "@fortawesome/free-solid-svg-icons/faFont";

import ContentEditable from "react-contenteditable";

import { getFileType } from "../../views/FileUpload/util";

import GIContainer from "../../containers/GIContainer";

import { teamMembers } from "../../../website/TeamPage/teamMembers";

import "./style.css";

class CreateWebsiteBlog extends Component {
  state = {
    authorID: undefined,
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
        const { contentArray, images } = ghostitBlog;
        console.log(ghostitBlog);

        if (ghostitBlog) {
          const mixedContentArray = [];
          if (images)
            for (let i = 0; i < images.length; i++) {
              const image = images[i];
              mixedContentArray[image.location] = image;
            }
          if (contentArray)
            for (let i = 0; i < contentArray.length; i++) {
              const content = contentArray[i];
              mixedContentArray[content.location] = content;
            }

          for (let index in contentArray) {
            if (!contentArray[index]) contentArray.splice(index, 1);
          }

          if (this._ismounted) {
            this.setState({
              authorID: ghostitBlog.authorID,
              category: ghostitBlog.category,
              contentArray: mixedContentArray,
              id: ghostitBlog._id,
              url: ghostitBlog.url
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
    if (index2 === "html")
      contentArray[index][index2] = contentArray[index][index2].replace(
        /style="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi,
        ""
      );
    this.setState({ contentArray });
  };
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };

  removeIndex = index => {
    const { contentArray, deleteImageArray } = this.state;
    if (contentArray[index].url)
      deleteImageArray.push(contentArray[index].publicID);
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
          alt: "",
          file: reader.result,
          image,
          size: "small",
          type: getFileType(image)
        });

        this.setState({ contentArray });
      };
      reader.readAsDataURL(image);
    }
  };
  saveGhostitBlog = () => {
    let {
      authorID,
      category,
      contentArray,
      deleteImageArray,
      id,
      url
    } = this.state;

    if (!url) {
      alert("Add url!");
      return;
    }
    alert("saving");
    axios
      .post("/api/ghostit/blog", {
        authorID,
        category,
        contentArray,
        deleteImageArray,
        id,
        url
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
      <GIContainer
        className={
          "relative full-center column ghostit-blog-img-container image " +
          image.size +
          (image.size === "medium" ? "" : " mr16")
        }
        key={"image" + index}
      >
        <div
          className="hover-options-container"
          style={{
            backgroundColor: "var(--five-blue-color)"
          }}
        >
          <button
            className="white"
            onClick={() => this.handleContentChange("tiny", index, "size")}
          >
            tiny
          </button>
          <button
            className="white"
            onClick={() => this.handleContentChange("small", index, "size")}
          >
            small
          </button>
          <button
            className="white"
            onClick={() => this.handleContentChange("medium", index, "size")}
          >
            medium
          </button>
          <button
            className="white"
            onClick={() => this.handleContentChange("large", index, "size")}
          >
            large
          </button>
        </div>
        <div className="top-right-over-div">
          <FontAwesomeIcon
            icon={faTrash}
            className="delete"
            onClick={() => this.removeIndex(index)}
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
        <img alt="" className="fill-parent br8" src={image.file || image.url} />

        <input
          className="regular-input x-fill border-box"
          value={image.alt ? image.alt : ""}
          placeholder="alt"
          onChange={e => this.handleContentChange(e.target.value, index, "alt")}
        />
      </GIContainer>
    );
  };

  editableTextbox = (content, index) => {
    return (
      <div
        className="relative bg-white"
        id="editable-text-container"
        key={index}
      >
        <div className="top-right-over-div">
          <FontAwesomeIcon
            icon={faTrash}
            className="delete"
            onClick={() => this.removeIndex(index)}
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
        <ContentEditable
          className="block pa4"
          disabled={false}
          html={content.html}
          innerRef={this.contentEditable}
          onChange={e =>
            this.handleContentChange(e.target.value, index, "html")
          }
        />
      </div>
    );
  };

  render() {
    const { authorID, category, contentArray, hyperlink, url } = this.state;

    const blogDivs = [];

    for (let index = 0; index < contentArray.length; index++) {
      const content = contentArray[index];
      if (!content) continue;
      if (content.size) {
        blogDivs.push(this.createRelevantImageDiv(content, index));
      } else {
        blogDivs.push(this.editableTextbox(content, index));
      }
    }

    return (
      <GIContainer className="x-fill justify-center">
        <GIContainer className="container-box large ov-visible block mb64">
          <Link to="/blog">Go to Blog</Link>
          <GIContainer className="wrap my8">
            <p className="label mr8">Choose Author :</p>
            {teamMembers.map((teamMember, index) => (
              <GIContainer
                className={
                  "button-1 pa8 mr8 mb8 br4 " +
                  (teamMember._id === authorID ? "active" : "")
                }
                key={index}
                onClick={() => this.handleChange({ authorID: teamMember._id })}
              >
                {teamMember.name}
              </GIContainer>
            ))}
          </GIContainer>
          <div className="flex my8">
            <p className="label mr8">Blog URL:</p>
            <input
              type="text"
              onChange={e => this.setState({ url: e.target.value })}
              value={url || ""}
              className="regular-input"
              placeholder="10-marketing-strategies"
            />
            <p className="label mx8">Category: (number)</p>
            <input
              className="regular-input"
              type="number"
              value={category || ""}
              onChange={e => this.setState({ category: e.target.value })}
            />
          </div>

          {blogDivs}

          <div
            className="wrapping-container shadow"
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
              value={hyperlink || ""}
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
              onChange={event =>
                this.insertImage(event, contentArray.length - 1)
              }
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
        </GIContainer>
      </GIContainer>
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
