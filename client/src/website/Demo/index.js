import React, { Component } from "react";

import { Link } from "react-router-dom";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

class ViewWebsiteBlog extends Component {
  render() {
    const { location } = this.props;
    const { pathname } = location;
    let number = 1;
    if (pathname) number = Number(pathname.slice(21, pathname.length));

    let src = "";
    if (number === 1)
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603231615/Revised-homepage.jpg";
    if (number === 2)
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603231602/Homepage-Option_02.jpg";
    if (number === 3)
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603231600/Homepage-Option_01.jpg";
    if (number === 4)
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603231606/Homepage-Option_04.jpg";

    return <img className="x-fill" src={src} />;
  }
}

export default ViewWebsiteBlog;
