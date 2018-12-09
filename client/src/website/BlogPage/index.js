import React, { Component } from "react";
import axios from "axios";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faEdit from "@fortawesome/fontawesome-free-solid/faEdit";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import LoaderSimpleCircle from "../../components/Notifications/LoaderSimpleCircle";
import ViewWebsiteBlog from "../../components/GhostitBlog/View";

import "./style.css";

class BlogPage extends Component {
  state = {
    loading: true,
    categories: [
      { value: "Most Recent", active: true },
      { value: "Road to 100", active: false },
      { value: "Content and Coffee", active: false },
      { value: "Content Marketing", active: false }
    ]
  };
  componentDidMount() {
    axios.get("/api/ghostit/blogs").then(res => {
      let { success, ghostitBlogs } = res.data;
      if (success) this.setState({ ghostitBlogs, loading: false });
      else {
        alert(
          "Cannot load page at this time. Please reload the page or try again later."
        );
      }
    });
  }
  switchDivs = activeCategory => {
    let { categories } = this.state;
    for (let index in categories) {
      categories[index].active = false;
    }
    categories[activeCategory].active = true;
    this.setState({ categories });
  };
  render() {
    const { ghostitBlogs, loading, categories } = this.state;
    const { user } = this.props;
    let isAdmin = false;
    if (user) if (user.role === "admin") isAdmin = true;

    if (loading)
      return (
        <div className="website-page">
          <LoaderSimpleCircle />
        </div>
      );

    let ghostitBlogDivs = [];
    for (let index in ghostitBlogs) {
      let ghostitBlog = ghostitBlogs[index];
      if (!categories[0].active) {
        if (!ghostitBlog.category) continue;
        else if (!categories[ghostitBlog.category].active) continue;
      }

      ghostitBlogDivs.push(
        <div className="background-container" key={index}>
          <Link
            to={ghostitBlog.url}
            className="container-box small ma32 common-shadow relative br4 button"
          >
            <div
              className="preview-blog-cover width100"
              style={
                ghostitBlog.images[0]
                  ? {
                      backgroundImage: "url(" + ghostitBlog.images[0].url + ")"
                    }
                  : {}
              }
            />
            <div className="common-container py8 px16">
              <h4 className="silly-font tac">
                {ghostitBlog.contentArray[0].text}
              </h4>
            </div>
          </Link>
          {isAdmin && (
            <Link to={"/manage/" + ghostitBlog._id}>
              <FontAwesomeIcon
                className="icon-regular-button absolute bottom right"
                icon={faEdit}
              />
            </Link>
          )}
        </div>
      );
    }
    return (
      <div className="website-page simple-container mx32">
        <h1 className="tac pb32">Ghostit Blog</h1>

        <div className="nowrap-container width100">
          {Object.keys(categories).map((categoryIndex, index) => {
            let category = categories[categoryIndex];

            let className = "transparent-button mx8";
            if (category.active) className += " active";

            return (
              <button
                className={className}
                onClick={() => this.switchDivs(categoryIndex)}
                key={"xyu" + index}
              >
                {category.value}
              </button>
            );
          })}
        </div>
        <div className="wrapping-container">{ghostitBlogDivs}</div>
      </div>
    );
  }
}

function ghostitBlogImagesCompare(a, b) {
  if (a.location < b.location) return -1;
  if (a.location > b.location) return 1;
  return 0;
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(BlogPage);
