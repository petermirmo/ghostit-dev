import React, { Component } from "react";
import MetaTags from "react-meta-tags";

import "./style.css";

class ViewWebsiteBlog extends Component {
  createRelevantImageDiv = (image, index) => {
    return (
      <div className="simple-container" key={"image" + index}>
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
              dangerouslySetInnerHTML={{ __html: content.html }}
              key={"fdj" + index}
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
            dangerouslySetInnerHTML={{ __html: content.html }}
            key={"fdj" + index}
          />
        );
        contentArrayIndex += 1;
      }
    }
    return (
      <div className="website-page common-container-center pb32">
        <MetaTags>
          <title>
            {contentArray[0]
              ? "Ghosit | " + contentArray[0].text
              : "Ghostit | Blog Post."}
          </title>
          <meta
            name="description"
            content={
              contentArray[1]
                ? contentArray[1].text
                : "What are you waiting for? Get reading!."
            }
          />
        </MetaTags>
        <div className="simple-container medium">{divs}</div>
      </div>
    );
  }
}

export default ViewWebsiteBlog;
