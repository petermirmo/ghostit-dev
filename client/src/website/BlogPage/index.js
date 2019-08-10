import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";

import Consumer from "../../context";

import LoaderSimpleCircle from "../../components/notifications/LoaderSimpleCircle";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import NavigationLayout from "../../components/navigations/NavigationLayout";

import GIText from "../../components/views/GIText";
import GIButton from "../../components/views/GIButton";

import Blog from "./Blog";

import { isMobileOrTablet } from "../../util";

import "./style.css";

class BlogPage extends Component {
  state = {
    activeBlogCategory: 0,
    categories: ["Recent Posts", "Most Popular", "Social Marketing"]
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  findFirstImageIndex = images => {
    let firstImageIndex = 0;

    for (let index in images) {
      if (images[index].location < images[firstImageIndex].location)
        firstImageIndex = index;
    }

    return firstImageIndex;
  };
  render() {
    const { activeBlogCategory, categories } = this.state;
    const { user } = this.props;

    return (
<<<<<<< HEAD
      <Page
        className="simple-container website-page"
        title="Blog"
        description="Welcome to the Ghostit Blog! Enjoy awesome marketing guides, social media marketing tips and tricks, and how to create a motivating company culture!"
        keywords="ghostit, blog"
      >
        <GIText className="tac pb32" text="Ghostit Blog" type="h1" />

        <NavigationLayout
          className="x-wrap full-center"
          data={categories.map((category, index) => (
            <GIButton
              className="transparent-button mx8 hover-blue"
              key={index}
              onClick={() => this.setState({ activeBlogCategory: index })}
              text={category}
            />
          ))}
        />
        <GIContainer className="column fill-parent">
          {loading && (
            <GIContainer className="fill-parent full-center">
              <LoaderSimpleCircle />
            </GIContainer>
          )}
          {!loading && (
            <GIContainer className="x-wrap fill-parent justify-center">
              {ghostitBlogs.map((ghostitBlog, index) => {
                if (
                  activeBlogCategory === ghostitBlog.category ||
                  !activeBlogCategory
                )
                  return (
                    <GIContainer key={index}>
                      <Link
                        to={"blog/" + ghostitBlog.url}
                        className="container-box column small ma32 common-shadow br4 button"
                      >
                        <div
                          className="image-cover width100"
                          style={
                            ghostitBlog.images[0]
                              ? {
                                  backgroundImage:
                                    "url(" +
                                    ghostitBlog.images[
                                      this.findFirstImageIndex(
                                        ghostitBlog.images
                                      )
                                    ].url +
                                    ")"
                                }
                              : {}
                          }
                        />
                        {ghostitBlog.contentArray[0] && (
                          <div className="common-container py8 px16">
                            <h3 className="tac">
                              {getTextFromHtmlTag(
                                ghostitBlog.contentArray[0].html
                              )}
                            </h3>
                          </div>
                        )}
                      </Link>
                      {isAdmin(user) && (
                        <Link to={"/manage/" + ghostitBlog._id}>
                          <FontAwesomeIcon
                            className="icon-regular-button absolute bottom right"
                            icon={faEdit}
                          />
                        </Link>
=======
      <Consumer>
        {context => (
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
                      onClick={() =>
                        this.setState({ activeBlogCategory: index })
                      }
                      text={category}
                      type="h6"
                    >
                      {activeBlogCategory === index && (
                        <div className="border-bottom-50" />
>>>>>>> c5fedc928fda4a278e35999048e48051643e20bd
                      )}
                    </GIText>
                  ))}
                />
              </GIContainer>
            </GIContainer>
            <GIContainer className="fill-parent px64 mb64">
              {context.ghostitBlogs.length === 0 && (
                <GIContainer className="fill-parent full-center">
                  <LoaderSimpleCircle />
                </GIContainer>
              )}
              {context.ghostitBlogs.length !== 0 && (
                <GIContainer className="grid-300px grid-gap-32 x-fill">
                  {context.ghostitBlogs.map((ghostitBlog, index) => (
                    <Blog
                      activeBlogCategory={activeBlogCategory}
                      ghostitBlog={ghostitBlog}
                      key={index}
                      user={user}
                    />
                  ))}
                </GIContainer>
              )}
            </GIContainer>
          </Page>
        )}
      </Consumer>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(BlogPage);
