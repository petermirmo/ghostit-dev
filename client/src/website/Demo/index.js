import React, { Component } from "react";

import { Link } from "react-router-dom";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

class Demo extends Component {
  render() {
    const { location } = this.props;
    const { pathname } = location;
    let lastUrlPart;
    if (pathname) lastUrlPart = pathname.slice(9, pathname.length);
    console.log(lastUrlPart);

    let src = "";
    if (lastUrlPart === "about-us")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907816/About-Us-Page-Option_01.jpg";
    if (lastUrlPart === "about-us-2")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907826/About-Us-Page-Option_02.jpg";
    if (lastUrlPart === "blog")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907848/Blog-Page-Option_01.jpg";
    if (lastUrlPart === "blog-2")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907849/Blog-Page-Option_02.jpg";
    if (lastUrlPart === "borrowing")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907840/Borrowing-Page-Option_01.jpg";
    if (lastUrlPart === "borrowing-2")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907846/Borrowing-Page-Option_02.jpg";
    if (lastUrlPart === "contact-us")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907848/Contact-Us-Page-Option_01.jpg";
    if (lastUrlPart === "contact-us-2")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907849/Contact-Us-Page-Option_02.jpg";
    if (lastUrlPart === "investing")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907852/Investing-Page-Option_01.jpg";
    if (lastUrlPart === "investing-2")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907841/Investing-Page-Option_02.jpg";
    if (lastUrlPart === "projects")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907827/Projects-Page-Option_01.jpg";
    if (lastUrlPart === "projects-2")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907828/Projects-Page-Option_02.jpg";
    if (lastUrlPart === "home")
      src =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1603907837/Revised-homepage-V1.jpg";

    if (!src) return <div>hello world</div>;
    return <img className="x-fill" src={src} />;
  }
}

export default Demo;
