import React, { Component } from "react";
import MetaTags from "react-meta-tags";

import "./style.css";

class ViewWebsiteBlog extends Component {
  createRelevantImageDiv = (image, index) => {
    return (
      <div className="simple-container my32" key={"image" + index}>
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
            <div
              key={"fdj" + index}
              className="simple-container large px32"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
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
          <div
            key={"fdj" + index}
            className="simple-container large px32"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />
        );
        contentArrayIndex += 1;
      }
    }
    let metaTitle = "";
    let temp = document.createElement("div");
    temp.innerHTML =
      "<div   dangerouslySetInnerHTML={{__html: " + contentArray[0].html + "";

    metaTitle = temp.textContent || temp.innerText || "";

    let metaDescription = "";
    let temp2 = document.createElement("div");
    temp2.innerHTML =
      "<div   dangerouslySetInnerHTML={{__html: " + contentArray[1].html + "";

    metaDescription = temp2.textContent || temp2.innerText || "";
    return (
      <div className="website-page common-container-center pb32">
        <MetaTags>
          <title>
            {metaTitle ? "Ghosit | " + metaTitle : "Ghostit | Blog Post."}
          </title>
          <meta
            name="description"
            content={
              metaDescription
                ? metaDescription
                : "What are you waiting for? Get reading!."
            }
          />
        </MetaTags>
        <div className="common-container-center">{divs}</div>
      </div>
    );
  }
}

export default ViewWebsiteBlog;
