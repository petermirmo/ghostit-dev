import React, { Component } from "react";
import axios from "axios";

import LoaderSimpleCircle from "../../components/Notifications/LoaderSimpleCircle";

import "./style.css";

class BlogPage extends Component {
  state = {
    loading: true
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
  render() {
    const { ghostitBlogs, loading } = this.state;
    if (loading)
      return (
        <div className="website-page">
          <LoaderSimpleCircle />
        </div>
      );
    else
      return (
        <div className="website-page">
          <div className="flex wrap mx64 ">
            {ghostitBlogs.map((obj, index) => {
              return (
                <div className="flex1 flex column mx32 width100" key={index}>
                  <div
                    className="top-container flex1 flex hc vc width100"
                    style={{
                      backgroundImage: "url(" + obj.images[0].url + ")"
                    }}
                  />
                  <div className="bottom-container flex hc vc py8 width100 px16">
                    <p className="width50 silly-font">{obj.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
  }
}
export default BlogPage;
