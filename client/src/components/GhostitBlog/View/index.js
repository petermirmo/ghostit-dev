import React, { Component } from "react";

import "./style.css";

class ViewWebsiteBlog extends Component {
  createRelevantContentDiv = (divInformation, index) => {
    let style = { whiteSpace: "pre-line" };

    if (divInformation.bold) style.fontWeight = "bold";
    if (divInformation.italic) style.fontStyle = "italic";
    if (divInformation.underline) style.textDecoration = "underline";

    if (divInformation.position === "left") style.textAlign = "left";
    else if (divInformation.position === "center") style.textAlign = "center";
    else if (divInformation.position === "right") style.textAlign = "right";

    if (divInformation.type === "p")
      return (
        <p style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
        </p>
      );
    else if (divInformation.type === "h1")
      return (
        <h1 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
        </h1>
      );
    else if (divInformation.type === "h2")
      return (
        <h2 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
        </h2>
      );
    else if (divInformation.type === "h3")
      return (
        <h3 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
        </h3>
      );
    else if (divInformation.type === "h4")
      return (
        <h4 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
        </h4>
      );
    else if (divInformation.type === "h5")
      return (
        <h5 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
        </h5>
      );
    else if (divInformation.type === "h6")
      return (
        <h6 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
        </h6>
      );
    else if (divInformation.type === "span")
      return (
        <span style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
        </span>
      );
    else if (divInformation.type === "a")
      return (
        <a style={style} key={"div" + index} className="mx20vw" href={link}>
          {divInformation.text}
        </a>
      );
  };
  createRelevantImageDiv = (image, index) => {
    return (
      <div className="margin-hc simple-container" key={"image" + index}>
        <img
          key={"image " + index}
          src={image.imagePreviewUrl || image.url}
          className={"image " + image.size}
        />
      </div>
    );
  };
  render() {
    const { contentArray, images } = this.props;
    let divs = [];

    let imageCounter = 0;
    let contentCounter = 0;

    for (let index = 0; index < contentArray.length + images.length; index++) {
      let content = contentArray[contentCounter];
      let image = images[imageCounter];
      if (content && image) {
        if (image.location > content.location) {
          divs.push(this.createRelevantContentDiv(content, index));
          contentCounter += 1;
        } else {
          divs.push(this.createRelevantImageDiv(image, index));
          imageCounter += 1;
        }
      } else if (image) {
        divs.push(this.createRelevantImageDiv(image, index));
        imageCounter += 1;
      } else {
        divs.push(this.createRelevantContentDiv(content, index));
        contentCounter += 1;
      }
    }
    return <div className="website-page simple-container">{divs}</div>;
  }
}

export default ViewWebsiteBlog;
