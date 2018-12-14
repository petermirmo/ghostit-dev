import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faLongArrowAltLeft from "@fortawesome/fontawesome-free-solid/faLongArrowAltLeft";
import faLongArrowAltRight from "@fortawesome/fontawesome-free-solid/faLongArrowAltRight";

import "./style.css";

class LinkPreview extends Component {
  state = {
    linkImagesArray: this.props.linkImagesArray
      ? this.props.linkImagesArray
      : [],
    activeImageIndex: 0
  };

  componentDidMount() {
    if (this.props.linkImage) {
      let temp = this.props.linkImagesArray;
      temp.unshift(this.props.linkImage);
      this.setState({ linkImagesArray: temp });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ linkImagesArray: nextProps.linkImagesArray });
  }
  changeImage = increment => {
    let { activeImageIndex, linkImagesArray } = this.state;
    activeImageIndex += increment;
    if (activeImageIndex >= linkImagesArray.length) {
      activeImageIndex = 0;
    } else if (activeImageIndex <= 0) {
      activeImageIndex = linkImagesArray.length - 1;
    }
    this.props.handleChange(linkImagesArray[activeImageIndex]);
    this.setState({ activeImageIndex: activeImageIndex });
  };
  render() {
    let { linkPreviewCanEdit, linkImage, className } = this.props;
    return (
      <div
        className={"link-preview-container common-shadow " + className}
        style={
          linkImage
            ? {
                backgroundImage: "url(" + linkImage + ")"
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
    );
  }
}

export default LinkPreview;
