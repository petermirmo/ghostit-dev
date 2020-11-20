import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";

import { Link } from "react-router-dom";

import { ExtraContext } from "../../../context";

import Page from "../../containers/Page";
import GIContainer from "../../containers/GIContainer";
import GIText from "../../views/GIText";

import { getTextFromHtmlTag, isMobileOrTablet } from "../../../util";
import { createBlogDivs, createContentImagesArray } from "./util";

import { getGhostitBlogs } from "../../../website/BlogPage/util";

import "./style.css";

const getTitleFromURL = (pathname) => {
  // regular expression will not work due to catastrophic backtracing
  //pathname.match(/(?<=\/problem\/\s*).*?(?=\s*\/)/gs);
  if (pathname) {
    const ventIdStart = pathname.slice(6, pathname.length);
    let ventID = "";
    for (let index in ventIdStart) {
      if (ventIdStart[index] === "/") break;
      ventID += ventIdStart[index];
    }

    return ventID;
  }
};

class ViewWebsiteBlog extends Component {
  state = {};
  componentDidMount() {
    this._ismounted = true;
    this.initialize();
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  initialize = () => {
    const { location } = this.props;
    const { pathname } = location;

    const regexMatch = getTitleFromURL(pathname);
    let urlTitle;
    if (regexMatch) urlTitle = regexMatch;

    if (this.context.ghostitBlogs.length === 0) {
      getGhostitBlogs((ghostitBlogs) => {
        if (
          ghostitBlogs &&
          ghostitBlogs.length > 0 &&
          this.context.ghostitBlogs.length === 0
        )
          this.context.handleChange({
            ghostitBlogs: this.context.ghostitBlogs.concat(ghostitBlogs),
          });
      }, 0);
    }

    if (urlTitle) {
      axios.get("/api/ghostit/blog/" + urlTitle).then((results) => {
        const { ghostitBlog, success } = results.data;

        if (ghostitBlog && success)
          if (this._ismounted)
            this.setState({
              authorID: ghostitBlog.authorID,
              contentArray: ghostitBlog.contentArray,
              id: ghostitBlog._id,
              images: ghostitBlog.images,
              url: ghostitBlog.url,
            });
      });
    } else alert("Blog not found!");
  };
  findFirstImage = (images) => {
    let location = images[0].location;
    let indexOfSmallestLocation = 0;
    for (let index in images) {
      if (images[index].location < location) indexOfSmallestLocation = index;
    }
    return indexOfSmallestLocation;
  };
  render() {
    const { authorID, contentArray = [], images = [], id, url } = this.state;
    const { ghostitBlogs } = this.context;

    const { location } = this.props;
    const { pathname } = location;

    const regexMatch = getTitleFromURL(pathname);
    let urlTitle;
    if (regexMatch) urlTitle = regexMatch;

    if (urlTitle && urlTitle !== url) this.initialize();

    const contentImagesArray = createContentImagesArray(contentArray, images);
    const divs = createBlogDivs(authorID, contentImagesArray);

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
        className="website-page align-center mt64 mb32"
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
            className={`blog block ${
              isMobileOrTablet() ? "x-fill px16" : "container-box large"
            }`}
          >
            {divs}
          </GIContainer>
          {!isMobileOrTablet() && (
            <GIContainer
              className="column ml64 x-300px"
              style={{ marginTop: "74px" }}
            >
              <GIContainer className="full-center">
                <a
                  className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb16 br32"
                  href="https://calendly.com/ghostitcm/intro-call"
                  target="_blank"
                >
                  Book a Call
                </a>
              </GIContainer>
              <GIText className="fs-26 mb16" text="Featured Blogs" type="h4" />
              {ghostitBlogs &&
                ghostitBlogs.slice(0, 3).map((ghostitBlog, index) => {
                  const { contentArray, createdAt } = ghostitBlog;
                  const ghostitBlogDate = new moment(createdAt);

                  if (ghostitBlog._id === id) return undefined;

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
                      className="x-fill column common-border one-blue bg-white shadow-3 button relative mb32 br16"
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
                                    "url(" +
                                    ghostitBlog.images[
                                      this.findFirstImage(ghostitBlog.images)
                                    ].url +
                                    ")",
                                }
                              : {}
                          }
                        ></GIContainer>
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
                                text={
                                  getTextFromHtmlTag(
                                    ghostitBlog.contentArray[1].html
                                  ).substring(0, 100) + "..."
                                }
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

ViewWebsiteBlog.contextType = ExtraContext;

export default ViewWebsiteBlog;
