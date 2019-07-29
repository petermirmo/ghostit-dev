import React, { Component } from "react";
import Page from "../../containers/Page";
import GIContainer from "../../containers/GIContainer";

import "./style.css";

class ViewWebsiteBlog extends Component {
  createRelevantImageDiv = (image, index) => {
    return (
      <img
        alt="Blog"
        className={
          "float-left ov-hidden br8 image " +
          image.size +
          (image.size === "medium" ? "" : " mr16")
        }
        key={index + "image"}
        src={image.file || image.url}
      />
    );
  };
  render() {
    const { contentArray = [], images = [] } = this.props;

    let divs = [];

    let imageCounter = 0;
    let contentArrayIndex = 0;

    for (let index in images) {
      const image = images[index];
      if (!image) continue;
      divs[image.location] = this.createRelevantImageDiv(image, index);
    }
    for (let index in contentArray) {
      const content = contentArray[index];
      if (!content) continue;
      divs[content.location] = (
        <div key={index} dangerouslySetInnerHTML={{ __html: content.html }} />
      );
    }

    let metaTitle = "";
    let temp = document.createElement("div");
    if (contentArray[0])
      temp.innerHTML =
        "<div   dangerouslySetInnerHTML={{__html: " + contentArray[0].html + "";

    metaTitle = temp.textContent || temp.innerText || "";

    let metaDescription = "";
    let temp2 = document.createElement("div");
    if (contentArray[1])
      temp2.innerHTML =
        "<div   dangerouslySetInnerHTML={{__html: " + contentArray[1].html + "";

    metaDescription = temp2.textContent || temp2.innerText || "";
    return (
      <Page
        className="website-page align-center"
        title={metaTitle ? metaTitle : "Blog Post"}
        description={
          metaDescription
            ? metaDescription
            : "What are you waiting for? Get reading!"
        }
        keywords="ghostit, blog"
      >
        <GIContainer className="container-box large block">{divs}</GIContainer>
      </Page>
    );
  }
}

export default ViewWebsiteBlog;
