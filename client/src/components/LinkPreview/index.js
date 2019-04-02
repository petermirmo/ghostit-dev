import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faLongArrowAltLeft from "@fortawesome/fontawesome-free-solid/faLongArrowAltLeft";
import faLongArrowAltRight from "@fortawesome/fontawesome-free-solid/faLongArrowAltRight";

import "./style.css";

class LinkPreview extends Component {
  state = { activeImageIndex: 0 };
  componentWillReceiveProps(nextProps) {
    if (nextProps.link != this.props.link)
      this.setState({ activeImageIndex: 0 });
  }
  changeImage = increment => {
    let { activeImageIndex } = this.state;
    const { linkImagesArray } = this.props;
    activeImageIndex += increment;

    if (activeImageIndex >= linkImagesArray.length) activeImageIndex = 0;
    else if (activeImageIndex <= 0)
      activeImageIndex = linkImagesArray.length - 1;

    this.props.handleChange(linkImagesArray[activeImageIndex]);
    this.setState({ activeImageIndex });
  };
  shortenLinkDescriptionIfNeeded = linkDescription => {
    if (linkDescription.length > 100)
      return linkDescription.substring(0, 100) + "...";
    else return linkDescription;
  };
  render() {
    const { activeImageIndex } = this.state;
    const {
      linkPreviewCanEdit,
      className,
      linkTitle,
      linkDescription,
      linkImagesArray
    } = this.props;

    const smartLinkDescription = this.shortenLinkDescriptionIfNeeded(
      linkDescription
    );

    return (
      <div className={className}>
        <div
          id="link-preview-container"
          className="common-shadow"
          style={
            linkImagesArray[activeImageIndex]
              ? {
                  backgroundImage:
                    "url(" + linkImagesArray[activeImageIndex] + ")"
                }
              : {}
          }
        >
          {linkPreviewCanEdit && (
            <div className="absolute-bottom-container">
              <FontAwesomeIcon
                icon={faLongArrowAltLeft}
                size="2x"
                className="icon-regular-button"
                onClick={() => this.changeImage(-1)}
              />
              <div className="flex1" />
              <FontAwesomeIcon
                icon={faLongArrowAltRight}
                size="2x"
                className="icon-regular-button"
                onClick={() => this.changeImage(1)}
              />
            </div>
          )}
        </div>
        <div className="simple-container py4">
          <h4>{linkTitle}</h4>
          <p>{smartLinkDescription}</p>
        </div>
      </div>
    );
  }
}

export default LinkPreview;
