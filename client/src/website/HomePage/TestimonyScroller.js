import React, { Component } from "react";

import GIContainer from "../../components/containers/GIContainer";
import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";

import { isMobileOrTablet } from "../../util";

import "./style.css";

class TestimonyScroller extends Component {
  render() {
    return (
      <GIContainer className="bg-blue-fade-2 x-fill column full-center relative">
        <GIText
          className="white muli fs-26 mt32"
          text="Here's What"
          type="h2"
        />
        <GIText
          className="white muli"
          text="Our Customers Are Saying"
          type="h2"
        />
        <GIContainer className="bg-white round pa8 mt32">
          <GIContainer className="xy-128px ov-hidden round">
            <img
              alt=""
              className="x-128px"
              src="https://res.cloudinary.com/ghostit-co/image/upload/v1566407434/home-testimony-1.png"
            />
          </GIContainer>
        </GIContainer>
        <GIText
          className={`white tac mt32 ${
            isMobileOrTablet() ? "x-fill px32" : "container-box large "
          }`}
          text="Repeatedly running digital campaigns for multiple clients can get both cumbersome and at times confusing. Ghostit's platform lets me schedule all of my client's marketing initiatives unlike any other platform and keep them all organized."
          type="p"
        />
        <GIText
          className="bold white tac mt32 mb8"
          text="Sean Wiggins"
          type="p"
        />
        <GIText
          className="white fs-13 tac mb32"
          text="North Digital Founder"
          type="p"
        />
        <img
          alt=""
          className="absolute bottom-0 x-fill"
          src={require("../../svgs/home-8.svg")}
        />
      </GIContainer>
    );
  }
}
export default TestimonyScroller;
