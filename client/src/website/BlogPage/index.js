import React, { Component } from "react";
import moment from "moment-timezone";
import Consumer, { ExtraContext } from "../../context";

import LoaderSimpleCircle from "../../components/notifications/LoaderSimpleCircle";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import NavigationLayout from "../../components/navigations/NavigationLayout";

import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";

import Blog from "./Blog";

import { getTextFromHtmlTag, isMobileOrTablet } from "../../util";

import { getGhostitBlogs } from "./util";

import "./style.css";

class BlogPage extends Component {
  state = {
    activeBlogCategory: 0,
    canLoadMoreBlogs: true,
    categories: ["Recent Posts", "Sort A-Z"]
  };
  componentDidMount() {
    this._ismounted = true;
  }

  getGhostitBlogs = () => {
    getGhostitBlogs(ghostitBlogs => {
      if (ghostitBlogs && ghostitBlogs.length > 0)
        this.context.handleChange({
          ghostitBlogs: this.context.ghostitBlogs.concat(ghostitBlogs)
        });
      let canLoadMoreBlogs = true;
      if (ghostitBlogs && ghostitBlogs.length < 10) canLoadMoreBlogs = false;

      this.handleChange({ canLoadMoreBlogs: false });
      window.setTimeout(() => {
        this.handleChange({ canLoadMoreBlogs });
      }, 10);
    }, this.context.ghostitBlogs.length);
  };
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };

  render() {
    const { activeBlogCategory, canLoadMoreBlogs, categories } = this.state;

    const { ghostitBlogs } = this.context;
    if (activeBlogCategory === 1)
      ghostitBlogs.sort((a, b) => {
        if (
          a.contentArray[0] &&
          b.contentArray[0] &&
          a.contentArray[0].html &&
          b.contentArray[0].html &&
          getTextFromHtmlTag(a.contentArray[0].html) >
            getTextFromHtmlTag(b.contentArray[0].html)
        ) {
        } else {
          return -1;
        }
      });
    else
      ghostitBlogs.sort((a, b) => {
        if (moment(a.createdAt) < moment(b.createdAt)) {
        } else {
          return -1;
        }
      });

    return (
      <Consumer>
        {context => (
          <Page
            className="website-page align-center pb32"
            description="Ghostit’s marketing blog shares insights into all facets of marketing including social media marketing, content marketing, and marketing automation."
            keywords="content creators"
            title="Ghostit Blog"
          >
            <GIContainer
              className={
                (isMobileOrTablet()
                  ? "column"
                  : "container-box extra-large grid-3-column") +
                " x-fill mt64 px64"
              }
            >
              <GIText
                className="four-blue muli x-fill mb32"
                text="Blog"
                type="h2"
              />
              <GIContainer className="full-center x-fill mb32">
                <NavigationLayout
                  className="bg-white shadow-3 wrap full-center common-border one-blue px16 br4"
                  data={categories.map((category, index) => (
                    <GIText
                      className="transparent-button tac button hover-blue relative py8 mx8"
                      key={index}
                      onClick={() => {
                        this.setState({ activeBlogCategory: index });
                      }}
                      text={category}
                      type="h6"
                    >
                      {activeBlogCategory === index && (
                        <div className="border-bottom-50" />
                      )}
                    </GIText>
                  ))}
                />
              </GIContainer>
            </GIContainer>
            <GIContainer
              className={`${
                isMobileOrTablet()
                  ? "x-fill px32 pb32"
                  : "container-box extra-large wrap px64 ob64"
              }`}
            >
              {ghostitBlogs.length === 0 && (
                <GIContainer className="fill-parent full-center">
                  <LoaderSimpleCircle />
                </GIContainer>
              )}

              {ghostitBlogs.length !== 0 && (
                <GIContainer
                  className={
                    "x-fill mb32 " +
                    (isMobileOrTablet()
                      ? "grid-200px grid-gap-16"
                      : "grid-300px grid-gap-32")
                  }
                >
                  {ghostitBlogs.map((ghostitBlog, index) => (
                    <Blog
                      ghostitBlog={ghostitBlog}
                      key={index}
                      user={context.user}
                    />
                  ))}
                </GIContainer>
              )}
              {canLoadMoreBlogs && (
                <GIContainer className="x-fill full-center py16">
                  <GIButton
                    className="shadow-blue common-border four-blue px16 py8 br32"
                    onClick={() => this.getGhostitBlogs()}
                    text="Load More"
                  />
                </GIContainer>
              )}
            </GIContainer>
          </Page>
        )}
      </Consumer>
    );
  }
}

BlogPage.contextType = ExtraContext;

export default BlogPage;
