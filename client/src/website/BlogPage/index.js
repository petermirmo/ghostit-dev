import React, { Component } from "react";

import { connect } from "react-redux";

import Consumer from "../../context";

import LoaderSimpleCircle from "../../components/notifications/LoaderSimpleCircle";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import NavigationLayout from "../../components/navigations/NavigationLayout";

import GIText from "../../components/views/GIText";

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
  render() {
    const { activeBlogCategory, categories } = this.state;
    const { user } = this.props;

    return (
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
                  : "container-box extra-large x-wrap px64 ob64"
              }`}
            >
              {context.ghostitBlogs.length === 0 && (
                <GIContainer className="fill-parent full-center">
                  <LoaderSimpleCircle />
                </GIContainer>
              )}
              {context.ghostitBlogs.length !== 0 && (
                <GIContainer className="grid-300px grid-gap-32 x-fill mb32">
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
