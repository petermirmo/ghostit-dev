import React, { Component } from "react";

import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import Page from "../../containers/Page";
import GIContainer from "../../containers/GIContainer";
import GIText from "../../views/GIText";

import { getTextFromHtmlTag, isMobileOrTablet } from "../../../util";

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
    const { contentArray = [], featuredBlogs = [], images = [] } = this.props;

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
        className="website-page align-center mt32"
        title={metaTitle ? metaTitle : "Blog Post"}
        description={
          metaDescription
            ? metaDescription
            : "What are you waiting for? Get reading!"
        }
        keywords="ghostit, blog"
      >
        <GIContainer>
          <GIContainer className="container-box large block">
            {divs}
          </GIContainer>
          <GIContainer className="column ml32 x-300px">
            {!isMobileOrTablet() &&
              featuredBlogs.map((ghostitBlog, index) => {
                const { contentArray, createdAt } = ghostitBlog;
                const ghostitBlogDate = new moment(createdAt);

                let temp = document.createElement("div");
                if (contentArray[1])
                  temp.innerHTML =
                    "<div   dangerouslySetInnerHTML={{__html: " +
                    contentArray[1].html +
                    "";

                const metaDescription =
                  temp.textContent || temp.innerText || "";

                return (
                  <Link
                    className="x-fill column common-border one-blue shadow-3 button relative mb32 br16"
                    key={index}
                    to={ghostitBlog.url}
                  >
                    <GIContainer className="column pa32">
                      <GIContainer
                        className="image-cover x-fill relative br8"
                        style={
                          ghostitBlog.images[0]
                            ? {
                                backgroundImage:
                                  "url(" + ghostitBlog.images[0].url + ")"
                              }
                            : {}
                        }
                      >
                        <GIContainer
                          className="absolute top-0 left-0 bg-white full-center shadow-4 px16 py8"
                          style={{ borderBottomRightRadius: "4px" }}
                        >
                          <GIText
                            className="quicksand four-blue mr8"
                            text={ghostitBlogDate.format("DD")}
                            type="h4"
                          />
                          <GIText
                            className="bold"
                            text={`${ghostitBlogDate
                              .format("MMMM")
                              .substring(0, 3)}, ${ghostitBlogDate.year()}`}
                            type="p"
                          />
                        </GIContainer>
                      </GIContainer>
                      {ghostitBlog.contentArray[0] && (
                        <GIContainer className="column pt16">
                          <GIText
                            className="muli"
                            text={getTextFromHtmlTag(
                              ghostitBlog.contentArray[0].html
                            )}
                            type="h4"
                          />
                          {ghostitBlog.contentArray[1] && (
                            <GIText
                              className="pt8"
                              text={getTextFromHtmlTag(
                                ghostitBlog.contentArray[1].html
                              ).substring(0, 150)}
                              type="p"
                            />
                          )}
                        </GIContainer>
                      )}
                    </GIContainer>
                    <GIContainer className="absolute bottom--16 left-0 right-0 round-icon common-border four-blue margin-hc round bg-white common-shadow-blue-2 full-center">
                      <FontAwesomeIcon icon={faAngleRight} />
                    </GIContainer>
                  </Link>
                );
              })}
          </GIContainer>
        </GIContainer>
      </Page>
    );
  }
}

export default ViewWebsiteBlog;
