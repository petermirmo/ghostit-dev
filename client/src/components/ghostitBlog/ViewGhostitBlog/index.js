import React, { Component } from "react";

import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import Page from "../../containers/Page";
import GIContainer from "../../containers/GIContainer";
import GIText from "../../views/GIText";

import { getTextFromHtmlTag, isMobileOrTablet } from "../../../util";
import { createBlogDivs, createContentImagesArray } from "./util";

import "./style.css";

class ViewWebsiteBlog extends Component {
  render() {
    const { contentArray = [], featuredBlogs = [], images = [] } = this.props;

    const contentImagesArray = createContentImagesArray(contentArray, images);
    const divs = createBlogDivs(contentImagesArray);

    /*
divs[image.location] = this.createRelevantImageDiv(image, index);


    divs[content.location] = (
      <div key={index} dangerouslySetInnerHTML={{ __html: content.html }} />
    );*/

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
          <GIContainer
            className={`block ${
              isMobileOrTablet() ? "x-fill px16" : "container-box large"
            }`}
          >
            {divs}
          </GIContainer>
          {!isMobileOrTablet() && (
            <GIContainer className="column ml32 x-300px">
              {featuredBlogs.map((ghostitBlog, index) => {
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
                    <GIContainer className="absolute bottom--16 left-0 right-0 round-icon common-border four-blue margin-hc round bg-white shadow-blue-2 full-center">
                      <FontAwesomeIcon icon={faAngleRight} />
                    </GIContainer>
                  </Link>
                );
              })}
            </GIContainer>
          )}
        </GIContainer>
      </Page>
    );
  }
}

export default ViewWebsiteBlog;
