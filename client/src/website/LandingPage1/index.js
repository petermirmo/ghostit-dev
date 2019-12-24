import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/pro-light-svg-icons/faArrowRight";

import Consumer from "../../context";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";
import GIInput from "../../components/views/GIInput";

import Blog from "../BlogPage/Blog";

import { isMobileOrTablet } from "../../util";

import "./style.css";

class LandingPage1 extends Component {
  state = {
    email: "",
    name: ""
  };
  render() {
    const { email, name } = this.state;
    return (
      <Consumer>
        {context => (
          <Page
            className="column"
            description="Organize your marketing process with an all-in-one marketing solution & agency for unified content development & promotion."
            homePage={true}
            keywords="content creators"
            title="Ghostit Marketing Solution and Agency"
          >
            <GIContainer
              className={`full-center x-fill ${
                isMobileOrTablet() ? "column" : "reverse"
              }`}
              style={{ minHeight: "90vh" }}
            >
              {isMobileOrTablet() && (
                <img
                  alt="blob"
                  id="blob-under-login"
                  src={require("../../svgs/blob-under-login.svg")}
                  style={{ width: "95vw" }}
                />
              )}

              <GIContainer
                className={`${
                  isMobileOrTablet()
                    ? "x-fill full-center px32 mt64"
                    : "container-box medium"
                }`}
              >
                <GIContainer
                  className={`bg-orange-fade column pt8 br8 ${
                    isMobileOrTablet() ? "x-85" : "x-fill"
                  }`}
                >
                  <GIContainer className="x-fill bg-white column pa32 br8">
                    <GIText text="Top Secrets To" type="h5" />
                    <GIText text="Social Media" type="h2" />
                    <GIText
                      className="mb16"
                      text="Marketing Success"
                      type="h2"
                    />
                    <form
                      action="https://ghostit.us14.list-manage.com/subscribe/post?u=6295bbe9fa9b4ee614df357c4&amp;id=aab772526a"
                      className="flex column justify-center"
                      method="post"
                      name="mc-embedded-subscribe-form"
                      target="_blank"
                      noValidate
                    >
                      <GIInput
                        autoCapitalize="off"
                        autoCorrect="off"
                        className="px16 py8 mb8 br20"
                        name="EMAIL"
                        onChange={e => {
                          this.setState({ email: e.target.value });
                        }}
                        placeholder="Email address"
                        type="email"
                        value={email}
                      />
                      <GIInput
                        className="px16 py8 mb8 br20"
                        onChange={e => {
                          this.setState({ name: e.target.value });
                        }}
                        placeholder="Name"
                        value={name}
                        type="text"
                      />
                      <GIButton
                        className="white bg-blue-fade-5 px16 py8 br20"
                        name="subscribe"
                        type="submit"
                      >
                        Get Your Free Consultation Now
                      </GIButton>

                      <div
                        style={{ position: "absolute", left: "-5000px" }}
                        aria-hidden="true"
                      >
                        <input
                          type="text"
                          name="b_6295bbe9fa9b4ee614df357c4_aab772526a"
                          tabIndex="-1"
                          onChange={() => {}}
                          value=""
                        />
                      </div>
                    </form>
                  </GIContainer>
                </GIContainer>
              </GIContainer>
              <GIContainer
                className={`column full-center px32 ${
                  isMobileOrTablet()
                    ? "x-fill "
                    : "container-box medium align-start"
                }`}
              >
                <GIText
                  className="muli"
                  text="  Create. Customize."
                  type="h2"
                />
                <GIText
                  className="muli four-blue mb16"
                  text="Convert."
                  type="h2"
                />
                <GIText
                  className="mb32"
                  text="Organize your marketing process with an all-in-one solution for unified content promotion."
                  type="p"
                />
                <Link to="/sign-up">
                  <GIButton
                    className="bg-orange-fade-2 shadow-orange-2 white br32 py16 px32 mb32"
                    text="Get Started Now"
                  />
                </Link>
              </GIContainer>
            </GIContainer>

            <GIContainer
              className={`full-center x-fill  ${
                isMobileOrTablet() ? "column" : "mt64"
              }`}
            >
              <GIContainer
                className={`${
                  isMobileOrTablet()
                    ? "x-fill full-center px32"
                    : "container-box medium"
                }`}
              >
                <img
                  alt=""
                  className={`${isMobileOrTablet() ? "x-85" : "fill-parent"}`}
                  src={require("../../svgs/home-2.svg")}
                />
              </GIContainer>
              <GIContainer
                className={`column px32 ${
                  isMobileOrTablet()
                    ? "x-fill full-center"
                    : "container-box medium align-start"
                }`}
              >
                <GIText
                  className={`muli mb16 ${
                    isMobileOrTablet() ? "x-fill tac" : ""
                  }`}
                  type="h2"
                >
                  Powerful
                  <GIText
                    className="four-blue"
                    text="&nbsp;Analytics Features"
                    type="span"
                  />
                </GIText>
                <GIText
                  className="mb32"
                  text="Ghostit lets you map out marketing campaigns, assign instructions, and schedule your content directly from the platform so you can get more done in less time."
                  type="p"
                />
                <Link to="/sign-up">
                  <GIButton
                    className="bg-orange-fade-2 shadow-orange-2 white br32 py16 px32 mb32"
                    text="Get Started Now"
                  />
                </Link>
              </GIContainer>
            </GIContainer>
            <GIContainer className="x-fill full-center x-wrap">
              <GIContainer className="column mx8">
                <GIText
                  className={`bold muli mb16 ${
                    isMobileOrTablet() ? "x-fill tac" : ""
                  }`}
                  type="h6"
                >
                  Total
                  <GIText
                    className="four-blue"
                    text="&nbsp;Likes"
                    type="span"
                  />
                </GIText>
              </GIContainer>
              <GIContainer className="column mx8">
                <GIText
                  className={`bold muli mb16 ${
                    isMobileOrTablet() ? "x-fill tac" : ""
                  }`}
                  type="h6"
                >
                  Total
                  <GIText
                    className="four-blue"
                    text="&nbsp;Visits"
                    type="span"
                  />
                </GIText>
              </GIContainer>
              <GIContainer className="column mx8">
                <GIText
                  className={`bold muli mb16 ${
                    isMobileOrTablet() ? "x-fill tac" : ""
                  }`}
                  type="h6"
                >
                  Total
                  <GIText
                    className="four-blue"
                    text="&nbsp;Impressions"
                    type="span"
                  />
                </GIText>
              </GIContainer>
              <GIContainer className="column mx8">
                <GIText
                  className={`bold muli mb16 ${
                    isMobileOrTablet() ? "x-fill tac" : ""
                  }`}
                  type="h6"
                >
                  Total
                  <GIText
                    className="four-blue"
                    text="&nbsp;Views"
                    type="span"
                  />
                </GIText>
              </GIContainer>
            </GIContainer>

            <GIContainer className="x-fill full-center bg-orange-fade py32">
              <form
                action="https://ghostit.us14.list-manage.com/subscribe/post?u=6295bbe9fa9b4ee614df357c4&amp;id=aab772526a"
                className="flex full-center"
                method="post"
                name="m"
                target="_blank"
                noValidate
              >
                <GIInput
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="px16 py8 br20"
                  name="EMAIL"
                  onChange={e => {
                    this.setState({ email: e.target.value });
                  }}
                  placeholder="Email address"
                  type="email"
                  value={email}
                />
                <GIInput
                  className="px16 py8 br20"
                  onChange={e => {
                    this.setState({ name: e.target.value });
                  }}
                  placeholder="Name"
                  value={name}
                  type="text"
                />
                <GIButton
                  className="no-text-wrap white bg-blue-fade-5 px16 py8 br20"
                  name="subscribe"
                  type="submit"
                >
                  Get Your Free Consultation Now
                </GIButton>

                <div
                  style={{ position: "absolute", left: "-5000px" }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="b_6295bbe9fa9b4ee614df357c4_aab772526a"
                    tabIndex="-1"
                    onChange={() => {}}
                    value=""
                  />
                </div>
              </form>
            </GIContainer>

            <GIContainer
              className={`full-center x-fill my64 ${
                isMobileOrTablet() ? "column" : "reverse"
              }`}
            >
              <GIContainer
                className={`${
                  isMobileOrTablet()
                    ? "x-fill full-center px32"
                    : "container-box medium"
                }`}
              >
                <img
                  alt=""
                  className={`${isMobileOrTablet() ? "x-85" : "fill-parent"}`}
                  src={require("../../svgs/home-3.svg")}
                />
              </GIContainer>
              <GIContainer
                className={`column px32 ${
                  isMobileOrTablet()
                    ? "x-fill full-center"
                    : "container-box medium align-start "
                }`}
              >
                <GIText
                  className={`muli mb16 ${
                    isMobileOrTablet() ? "x-fill tac" : ""
                  }`}
                  type="h2"
                >
                  Machine
                  <GIText
                    className="four-blue"
                    text="&nbsp;Learning"
                    type="span"
                  />
                </GIText>

                <GIText
                  className="mb32"
                  text="Use the power of artificial intelligence to target the right marketing channels."
                  type="p"
                />
                <Link to="/sign-up">
                  <GIButton
                    className="bg-orange-fade-2 shadow-orange-2 white br32 py16 px32 mb32"
                    text="Get Started Now"
                  />
                </Link>
              </GIContainer>
            </GIContainer>

            <GIContainer className="full-center column my64">
              <GIText
                className="muli white tac relative mb32"
                text="More Features"
                type="h2"
              >
                <img
                  alt=""
                  id="blob-behind-more-features"
                  src={require("../../svgs/home-4.svg")}
                />
              </GIText>

              <GIContainer className="x-wrap full-center">
                <GIContainer className="container-box small column mb32">
                  <GIContainer className={isMobileOrTablet() ? "" : "mb16"}>
                    <img
                      alt=""
                      className="fill-parent"
                      src={require("../../svgs/home-5.svg")}
                    />
                  </GIContainer>
                  <GIText className="muli tac mb8" type="h4">
                    Custom
                    <GIText
                      className="four-blue"
                      text="&nbsp;Workflows"
                      type="span"
                    />
                  </GIText>
                  <GIText
                    className="tac"
                    text="Map your marketing campaign from scratch or use pre-built templates."
                    type="p"
                  />
                </GIContainer>

                <GIContainer className="container-box small column mb32">
                  <GIContainer className={isMobileOrTablet() ? "" : "mb16"}>
                    <img
                      alt=""
                      className="fill-parent"
                      src={require("../../svgs/home-6.svg")}
                    />
                  </GIContainer>
                  <GIText className="muli tac mb8" type="h4">
                    Post
                    <GIText
                      className="four-blue"
                      text="&nbsp;Instructions"
                      type="span"
                    />
                  </GIText>
                  <GIText
                    className="tac"
                    text="Add custom steps for your marketing campaign or follow existing ones with a pre-built template."
                    type="p"
                  />
                </GIContainer>

                <GIContainer className="container-box small column mb32">
                  <GIContainer className={isMobileOrTablet() ? "" : "mb16"}>
                    <img
                      alt=""
                      className="fill-parent"
                      src={require("../../svgs/home-7.svg")}
                    />
                  </GIContainer>
                  <GIText className="muli tac mb8" type="h4">
                    Social
                    <GIText
                      className="four-blue"
                      text="&nbsp;Scheduling"
                      type="span"
                    />
                  </GIText>
                  <GIText
                    className="tac"
                    text="Sync all your social sharing accounts and post directly from our platform."
                    type="p"
                  />
                </GIContainer>
              </GIContainer>
              <Link to="/sign-up">
                <GIButton
                  className="bg-orange-fade-2 shadow-orange-2 white br32 py16 px32"
                  text="Get Started Now"
                />
              </Link>
            </GIContainer>
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
            {context.ghostitBlogs.length !== 0 && (
              <GIContainer className="column full-center">
                <GIText className="muli x-fill tac mt64" type="h2">
                  Latest
                  <GIText
                    className="four-blue"
                    text="&nbsp;Blog Posts"
                    type="span"
                  />
                </GIText>
                {context.ghostitBlogs.length !== 0 && (
                  <GIContainer className="grid-300px grid-gap-32 x-fill px64 mt64">
                    {context.ghostitBlogs.map((ghostitBlog, index) => {
                      if (index > 2) return;
                      else
                        return <Blog ghostitBlog={ghostitBlog} key={index} />;
                    })}
                  </GIContainer>
                )}
                <Link to="/blog">
                  <GIButton
                    className="bg-white common-border four-blue shadow-blue-2 br32 py16 px32 my64"
                    text="View All Posts"
                  />
                </Link>
              </GIContainer>
            )}
          </Page>
        )}
      </Consumer>
    );
  }
}
export default LandingPage1;
