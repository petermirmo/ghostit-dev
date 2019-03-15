import React, { Component } from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faEdit from "@fortawesome/fontawesome-free-solid/faEdit";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import LoaderSimpleCircle from "../../components/notifications/LoaderSimpleCircle";
import ViewWebsiteBlog from "../../components/ghostitBlog/ViewGhostitBlog";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import NavigationLayout from "../../components/navigations/NavigationLayout";
import GIText from "../../components/views/GIText";

import { isAdmin, getTextFromHtmlTag, getGhostitBlogs } from "./util";

import "./style.css";

class BlogPage extends Component {
  state = {
    loading: true,
    categories: [
      "Most Recent",
      "Road to 100",
      "Content and Coffee",
      "Content Marketing",
      "Business"
    ],
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
        className="simple-container mx32 website-page"
        title="Blog"
        description="Welcome to the Ghostit Blog! Enjoy awesome marketing guides, social media marketing tips and tricks, and how to create a motivating company culture."
        keywords="ghostit, blog"
      >
        <GIText className="tac pb32" text="Ghostit Blog" type="h1" />

        <NavigationLayout
          className="x-wrap"
          data={categories.map((category, index) => (
            <button
              className="transparent-button mx8 hover-blue"
              key={index}
              onClick={() => this.setState({ activeBlogCategory: index })}
            >
              {category}
            </button>
          ))}
          className="full-center"
        />
        <GIContainer className="column fill-parent">
          {loading && (
            <GIContainer className="fill-parent full-center">
              <LoaderSimpleCircle />
            </GIContainer>
          )}
          {!loading && (
            <GIContainer className="x-wrap fill-parent">
              {ghostitBlogs.map((ghostitBlog, index) => {
                if (
                  activeBlogCategory === ghostitBlog.category ||
                  !activeBlogCategory
                )
                  return (
                    <div className="background-container" key={index}>
                      <Link
                        to={"blog/" + ghostitBlog.url}
                        className="container-box small ma32 common-shadow br4 button no-underline"
                      >
                        <div
                          className="preview-blog-cover width100"
                          style={
                            ghostitBlog.images[0]
                              ? {
                                  backgroundImage:
                                    "url(" + ghostitBlog.images[0].url + ")"
                                }
                              : {}
                          }
                        />
                        {ghostitBlog.contentArray[0] && (
                          <div className="common-container py8 px16">
                            <h3 className="silly-font tac">
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
                      )}
                    </div>
                  );
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
