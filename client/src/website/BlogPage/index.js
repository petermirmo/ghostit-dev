import React, { Component } from "react";

import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import LoaderSimpleCircle from "../../components/notifications/LoaderSimpleCircle";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import NavigationLayout from "../../components/navigations/NavigationLayout";

import GIText from "../../components/views/GIText";
import GIButton from "../../components/views/GIButton";

import { isAdmin, getTextFromHtmlTag } from "../../util";
import { getGhostitBlogs } from "./util";
import { isMobileOrTablet } from "../../util";

import "./style.css";

class BlogPage extends Component {
  state = {
    loading: true,
    categories: ["Recent Posts", "Most Popular", "Social Marketing"],
    activeBlogCategory: 0
  };
  componentDidMount() {
    this._ismounted = true;

    getGhostitBlogs(ghostitBlogs => {
      if (this._ismounted) this.setState({ ghostitBlogs, loading: false });
    });
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  render() {
    const {
      ghostitBlogs,
      loading,
      categories,
      activeBlogCategory
    } = this.state;
    const { user } = this.props;

    return (
      <Page
        className="website-page align-center"
        description="Welcome to the Ghostit Blog! Enjoy awesome marketing guides, social media marketing tips and tricks, and how to create a motivating company culture!"
        keywords="ghostit, blog"
        title="Blog"
      >
        <GIContainer
          className={
            "x-fill mt64 px64" +
            (isMobileOrTablet() ? " column" : " grid-3-column")
          }
        >
          <GIText
            className="four-blue muli x-fill mb32"
            text="Blog"
            type="h2"
          />
          <GIContainer className="full-center x-fill mb32">
            <NavigationLayout
              className="x-wrap full-center common-border one-blue px16 br4"
              data={categories.map((category, index) => (
                <GIText
                  className="transparent-button tac button hover-blue relative py8 mx8"
                  key={index}
                  onClick={() => this.setState({ activeBlogCategory: index })}
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
        <GIContainer className="fill-parent px64 mb64">
          {loading && (
            <GIContainer className="fill-parent full-center">
              <LoaderSimpleCircle />
            </GIContainer>
          )}
          {!loading && (
            <GIContainer className="grid-300px grid-gap-32 x-fill">
              {ghostitBlogs.map((ghostitBlog, index) => {
                const { contentArray, createdAt, images } = ghostitBlog;
                const ghostitBlogDate = new moment(createdAt);

                let temp = document.createElement("div");
                if (contentArray[1])
                  temp.innerHTML =
                    "<div   dangerouslySetInnerHTML={{__html: " +
                    contentArray[1].html +
                    "";

                const metaDescription =
                  temp.textContent || temp.innerText || "";

                if (
                  activeBlogCategory === ghostitBlog.category ||
                  !activeBlogCategory
                )
                  return (
                    <GIContainer className="relative" key={index}>
                      <Link
                        className="x-fill column common-border one-blue shadow-3 button relative br16"
                        to={"blog/" + ghostitBlog.url}
                      >
                        <GIContainer className="column pa32">
                          <GIContainer
                            className="image-cover x-fill relative br8"
                            style={
                              images[0]
                                ? {
                                    backgroundImage:
                                      "url(" + images[0].url + ")"
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
                      {isAdmin(user) && (
                        <Link to={"/manage/" + ghostitBlog._id}>
                          <FontAwesomeIcon
                            className="icon-regular-button absolute bottom right"
                            icon={faEdit}
                          />
                        </Link>
                      )}
                    </GIContainer>
                  );
                else return undefined;
              })}
            </GIContainer>
          )}
        </GIContainer>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(BlogPage);
