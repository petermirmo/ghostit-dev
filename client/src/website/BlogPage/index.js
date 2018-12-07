import React, { Component } from "react";
import axios from "axios";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faEdit from "@fortawesome/fontawesome-free-solid/faEdit";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import LoaderSimpleCircle from "../../components/Notifications/LoaderSimpleCircle";

import "./style.css";

class BlogPage extends Component {
  state = {
    loading: true,
    categories: {
      mostRecent: { value: "Most Recent", active: true },
      roadTo100: { value: "Road to 100", active: false },
      contentAndCoffee: { value: "Content and Coffee", active: false },
      contentMarketing: { value: "Content Marketing", active: false }
    }
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
    else
      return (
        <div className="website-page flex column vc mx64">
          <h1 className="silly-font pb16">Ghostit Blog</h1>

          <div className="flex hc vc ma32 width100">
            {Object.keys(categories).map((categoryIndex, index) => {
              let category = categories[categoryIndex];

              let className = "transparent-button";
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
          <div className="flex wrap width100">
            {ghostitBlogs.map((obj, index) => {
              return (
                <div
                  className="regular-container-with-border flex1 flex column mx32 br4 common-shadow relative"
                  key={index}
                >
                  <div
                    className="preview-blog-cover flex1 flex hc vc width100"
                    style={{
                      backgroundImage: "url(" + obj.images[0].url + ")"
                    }}
                  />
                  <div className="flex hc vc py8 width100 px16">
                    <p className="width50 silly-font">{obj.title}</p>
                  </div>
                  {isAdmin && (
                    <Link to={"/manage/" + obj._id}>
                      <FontAwesomeIcon
                        className="icon-regular-button absolute bottom right"
                        icon={faEdit}
                      />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(BlogPage);
