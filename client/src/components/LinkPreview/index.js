import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faLongArrowAltRight
} from "@fortawesome/free-solid-svg-icons";

import ContentEditable from "react-contenteditable";

import GIContainer from "../containers/GIContainer";

import FileUpload from "../views/FileUpload";
import "./style.css";

class LinkPreview extends Component {
  state = { activeImageIndex: 0 };

  componentWillReceiveProps(nextProps) {
    if (nextProps.link !== this.props.link)
      this.setState({ activeImageIndex: 0 });
  }
  changeImage = increment => {
    let { activeImageIndex } = this.state;
    const { linkCustomFiles = [], linkImagesArray = [] } = this.props; // Variables
    const { handleChange } = this.props; // Functions
    activeImageIndex += increment;

    if (activeImageIndex >= linkImagesArray.length + linkCustomFiles.length)
      activeImageIndex = 0;
    else if (activeImageIndex < 0) {
      activeImageIndex = linkImagesArray.length + linkCustomFiles.length - 1;
    }

    handleChange(linkImagesArray[activeImageIndex], "linkImage");
    this.setState({ activeImageIndex });
  };
  shortenLinkDescriptionIfNeeded = linkDescription => {
    if (linkDescription) {
      if (linkDescription.length > 100)
        return linkDescription.substring(0, 100) + "...";
      else return linkDescription;
    } else return linkDescription;
  };
  getTextFromHtml = htmlString => {
    let temp = document.createElement("div");
    if (htmlString)
      temp.innerHTML =
        "<div   dangerouslySetInnerHTML={{__html: " + htmlString + "";

    return temp.textContent || temp.innerText || "";
  };
  render() {
    const { activeImageIndex } = this.state;
    const {
      canAddFilesToLink,
      canEdit,
      className,
      id,
      linkCustomFiles = [],
      linkDescription,
      linkImagesArray = [],
      linkPreviewCanEdit,
      linkTitle
    } = this.props; // Variables
    const { handleChange, setCustomImages } = this.props; // Functions

    const linkImagesToDisplay = linkCustomFiles.concat(linkImagesArray);

    const smartLinkDescription = this.shortenLinkDescriptionIfNeeded(
      linkDescription
    );
    let urlImageToDisplay = linkImagesToDisplay[activeImageIndex];
    if (urlImageToDisplay)
      if (urlImageToDisplay.url) urlImageToDisplay = urlImageToDisplay.url;
    return (
      <div className={className}>
        <div
          id="link-preview-container"
          className="shadow"
          style={
            linkImagesToDisplay[activeImageIndex]
              ? {
                  backgroundImage: "url(" + urlImageToDisplay + ")"
                }
              : {}
          }
        >
          <GIContainer className="absolute x-fill y-fill column">
            {canAddFilesToLink && (
              <GIContainer className="full-center fill-flex file-upload-on-file">
                <FileUpload
                  canEdit={canEdit}
                  className="x-fill full-center"
                  currentFiles={[]}
                  handleParentChange={filesObject => {
                    if (filesObject.files)
                      if (filesObject.files[0]) {
                        linkImagesArray.unshift(filesObject.files[0].file);

                        setCustomImages(linkImagesArray);
                      }
                  }}
                  fileLimit={1}
                  filesToDelete={[]}
                  id={id ? id : "fdhssdafasd"}
                  imageClassName="flex image tiny"
                  imageOnly={true}
                />
              </GIContainer>
            )}
            {linkPreviewCanEdit && (
              <GIContainer className="px16 bg-grey">
                <FontAwesomeIcon
                  icon={faLongArrowAltLeft}
                  size="2x"
                  className="icon-regular-button"
                  onClick={() => this.changeImage(-1)}
                />
                <div className="fill-flex" />
                <FontAwesomeIcon
                  icon={faLongArrowAltRight}
                  size="2x"
                  className="icon-regular-button"
                  onClick={() => this.changeImage(1)}
                />
              </GIContainer>
            )}
          </GIContainer>
        </div>
        <div className="simple-container pa4">
          <ContentEditable
            className="pa4"
            disabled={!linkPreviewCanEdit}
            html={("<h4>" + linkTitle + "</h4>").toString()}
            innerRef={this.contentEditable}
            onChange={e =>
              handleChange(this.getTextFromHtml(e.target.value), "linkTitle")
            }
          />

          <ContentEditable
            className="pa4"
            disabled={!linkPreviewCanEdit}
            html={("<p>" + smartLinkDescription + "</p>").toString()}
            innerRef={this.contentEditable}
            onChange={e =>
              handleChange(
                this.getTextFromHtml(e.target.value),
                "linkDescription"
              )
            }
          />
        </div>
      </div>
    );
  }
}

export default LinkPreview;
