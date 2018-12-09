import React, { Component } from "react";

import "./style.css";

class ViewWebsiteBlog extends Component {
  createDivStyle = divInformation => {
    let style = { whiteSpace: "pre-line" };

    if (divInformation.bold) style.fontWeight = "bold";
    if (divInformation.italic) style.fontStyle = "italic";
    if (divInformation.underline) style.textDecoration = "underline";

    if (divInformation.position === "left") style.textAlign = "left";
    else if (divInformation.position === "center") style.textAlign = "center";
    else if (divInformation.position === "right") style.textAlign = "right";
    return style;
  };
  createRelevantContentDiv = (
    divInformation,
    index,
    contentArray,
    contentArrayIndex
  ) => {
    let style = this.createDivStyle(divInformation);

    let spanDivs = [];
    if (contentArray[contentArrayIndex + 1]) {
      let counter = 0;
      let divInformation2 = contentArray[contentArrayIndex + 1];
      while (divInformation2.type === "a" || divInformation2.type === "span") {
        counter++;
        let style2 = this.createDivStyle(divInformation2);
        if (divInformation2.type === "a") {
          spanDivs.push(
            <a
              style={style2}
              key={"div" + contentArrayIndex}
              href={divInformation2.link}
            >
              {divInformation2.text}
            </a>
          );
        }
        if (divInformation2.type === "span") {
          spanDivs.push(
            <span style={style2} key={"div" + contentArrayIndex}>
              {divInformation2.text}
            </span>
          );
        }
        divInformation2 = contentArray[contentArrayIndex + 1 + counter];
        if (!divInformation2) break;
      }
    }

    if (divInformation.type === "p")
      return (
        <p style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
          {spanDivs}
        </p>
      );
    else if (divInformation.type === "h1")
      return (
        <h1 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
          {spanDivs}
        </h1>
      );
    else if (divInformation.type === "h2")
      return (
        <h2 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
          {spanDivs}
        </h2>
      );
    else if (divInformation.type === "h3")
      return (
        <h3 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
          {spanDivs}
        </h3>
      );
    else if (divInformation.type === "h4")
      return (
        <h4 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
          {spanDivs}
        </h4>
      );
    else if (divInformation.type === "h5")
      return (
        <h5 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
          {spanDivs}
        </h5>
      );
    else if (divInformation.type === "h6")
      return (
        <h6 style={style} key={"div" + index} className="mx20vw">
          {divInformation.text}
          {spanDivs}
        </h6>
      );
  };
  createRelevantImageDiv = (image, index) => {
    return (
      <div className="margin-hc simple-container" key={"image" + index}>
        <img
          key={"xuwm " + index}
          src={image.imagePreviewUrl || image.url}
          className={"image br4 " + image.size}
        />
      </div>
    );
  };
  render() {
    const { contentArray, images } = this.props;
    let divs = [];

    let imageCounter = 0;
    let contentArrayIndex = 0;

    for (let index = 0; index < contentArray.length + images.length; index++) {
      let content = contentArray[contentArrayIndex];
      let image = images[imageCounter];
      if (content && image) {
        if (image.location > content.location) {
          divs.push(
            this.createRelevantContentDiv(
              content,
              index,
              contentArray,
              contentArrayIndex
            )
          );
          contentArrayIndex += 1;
        } else {
          divs.push(this.createRelevantImageDiv(image, index));
          imageCounter += 1;
        }
      } else if (image) {
        divs.push(this.createRelevantImageDiv(image, index));
        imageCounter += 1;
      } else {
        divs.push(
          this.createRelevantContentDiv(
            content,
            index,
            contentArray,
            contentArrayIndex
          )
        );
        contentArrayIndex += 1;
      }
    }
    return <div className="website-page simple-container pb32">{divs}</div>;
  }
}

export default ViewWebsiteBlog;
