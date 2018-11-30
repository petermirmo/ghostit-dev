import React, { Component } from "react";

import "./styles";

class ViewWebsiteBlog extends Component {
  createRelevantDiv = (divInformation, index) => {
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
  };
  render() {
    const { contentArray, coverImage } = this.props;
    let textDivs = [];
    for (let index in contentArray) {
      let divInformation = contentArray[index];
      textDivs.push(this.createRelevantDiv(divInformation, index));
    }
    return (
      <div className="flex column">
        {coverImage && (
          <div className="cover-image-container">
            <img
              src={coverImage.imagePreviewUrl}
              className="cover-image width100"
            />
          </div>
        )}
        {textDivs}
      </div>
    );
  }
}

export default ViewWebsiteBlog;
