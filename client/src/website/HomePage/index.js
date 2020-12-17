import React, { Component } from "react";
import { Link } from "react-router-dom";

import Consumer from "../../context";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";

import Blog from "../BlogPage/Blog";
import AgencyForm from "../../components/forms/AgencyForm";
import TestimonyScroller from "./TestimonyScroller";

import { isMobileOrTablet } from "../../util";

import "./style.css";

class RegularVersion extends Component {
  render() {
    return (
      <Consumer>
        {context => (
          <Page
            className="website-page"
            description="Organize your marketing process with an all-in-one marketing solution & agency for unified content development & promotion."
            homePage={true}
            keywords="content creators"
            title="Ghostit Marketing Solution and Agency"
          >
            <GIContainer
              className={`justify-center x-fill ${
                isMobileOrTablet() ? "column mb32 " : "reverse"
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
                className={`column full-center px32 ${
                  isMobileOrTablet()
                    ? "x-fill pt64 "
                    : "container-box extra-large"
                }`}
              >
                <GIText className="tac muli mb16" type="h2">
                  Powered by
                  <GIText className="bold" text=" People" type="span" />
                  , Supported by
                  <GIText className="bold" text=" Software" type="span" />
                </GIText>
                <GIText
                  className="fs-18 tac mb32"
                  text="Ghostit is an all-in-one content marketing solution that blends the benefits of real people with strategy-based technology. Our goal: to create compelling digital content that increases your web traffic and converts visitors into customers."
                  type="h4"
                />

                <Link
                  className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb8 br32"
                  to="/contact-us"
                >
                  Book a Call
                </Link>
                <GIText
                  className="fs-13 italic mb32"
                  text="It only takes 30 seconds!"
                  type="p"
                />
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
                  src={require("../../svgs/home-1.svg")}
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
                  Customized Creative
                  <GIText
                    className="four-blue2 bold"
                    text=" Content "
                    type="span"
                  />
                </GIText>
                <GIText
                  className={"mb32 " + (isMobileOrTablet() ? "x-fill tac" : "")}
                  text="Ghostit is your end-to-end solution for digital content marketing. From content strategy to creation to distribution and promotion. Waste less time and accomplish more with the right team behind you creating content that is tailored and created specifically for you."
                  type="p"
                />

                <Link
                  className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb16 br32"
                  to="/contact-us"
                >
                  Book a Call
                </Link>
              </GIContainer>
            </GIContainer>

            <GIContainer
              className={`full-center x-fill  ${
                isMobileOrTablet() ? "column my32" : "reverse my64"
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
                    : "container-box medium align-start "
                }`}
              >
                <GIText
                  className={`muli mb16 ${
                    isMobileOrTablet() ? "x-fill tac" : ""
                  }`}
                  type="h2"
                >
                  Increase Traffic &
                  <GIText
                    className="four-blue2 bold"
                    text=" Conversions"
                    type="span"
                  />
                </GIText>

                <GIText
                  className={"mb32 " + (isMobileOrTablet() ? "x-fill tac" : "")}
                  text="Great content does nothing if no one reads it. Successful digital marketing requires a strong understanding of data, SEO, and content marketing. The Ghostit team uses the power of data and software, along with engaging and creative content, to find and convert new customers."
                  type="p"
                />

                <Link
                  className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb16 br32"
                  to="/contact-us"
                >
                  Book a Call
                </Link>
              </GIContainer>
            </GIContainer>

            <GIContainer
              className={`full-center x-fill ${
                isMobileOrTablet() ? "column my32" : "my64"
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
                  Real
                  <GIText
                    className="four-blue2 bold"
                    text=" People "
                    type="span"
                  />
                  means Real
                  <GIText
                    className="four-blue2 bold"
                    text=" Results"
                    type="span"
                  />
                </GIText>

                <GIText
                  className={"mb32 " + (isMobileOrTablet() ? "x-fill tac" : "")}
                  text="We’re all about connection. Connect with our Ghostit Team of experienced writers to grow your digital marketing presence quickly and easily. We pride ourselves on being a collaborative team with all of our clients. Connect with us to connect with your ideal customers."
                  type="p"
                />

                <Link
                  className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb16 br32"
                  to="/contact-us"
                >
                  Book a Call
                </Link>
              </GIContainer>
            </GIContainer>
            <GIContainer
              className={`full-center x-fill ${
                isMobileOrTablet() ? "column my32" : "my64"
              }`}
            >
              <GIContainer
                className={
                  "column px32 " +
                  (isMobileOrTablet() ? "x-fill" : "container-box extra-large")
                }
              >
                <GIText className="tac muli mb16" type="h2">
                  Customized Creative
                  <GIText
                    className="four-blue2 bold"
                    text=" Content "
                    type="span"
                  />
                  Created, Scheduled, and Promoted Without You Lifting a Finger
                </GIText>
              </GIContainer>
            </GIContainer>

            <GIContainer
              className={
                "full-center column " + (isMobileOrTablet() ? "my32" : "my64")
              }
            >
              <GIContainer className="column relative mb32">
                <GIText
                  className="muli white tac  "
                  text="Powered by People,"
                  type="h2"
                />
                <GIText
                  className="muli white tac"
                  text="Scheduled by Software"
                  type="h2"
                />

                <img
                  alt=""
                  id="blob-behind-more-features"
                  src={require("../../svgs/home-4.svg")}
                />
              </GIContainer>

              <GIContainer className="wrap full-center px16">
                <GIContainer
                  className={
                    "column mb32 " +
                    (isMobileOrTablet() ? "x-fill" : "container-box small")
                  }
                >
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
                      className="four-blue2 bold"
                      text=" Scheduling"
                      type="span"
                    />
                  </GIText>
                  <GIText
                    className="tac"
                    text="Sync all your social sharing accounts and post directly from our platform."
                    type="p"
                  />
                </GIContainer>

                <GIContainer
                  className={
                    "column mb32 " +
                    (isMobileOrTablet() ? "x-fill" : "container-box small")
                  }
                >
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
                      className="four-blue2 bold"
                      text=" Workflows"
                      type="span"
                    />
                  </GIText>
                  <GIText
                    className="tac"
                    text="Map your marketing campaign from scratch or use pre-built templates."
                    type="p"
                  />
                </GIContainer>

                <GIContainer
                  className={
                    "column mb32 " +
                    (isMobileOrTablet() ? "x-fill" : "container-box small")
                  }
                >
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
                      className="four-blue2 bold"
                      text=" Instructions"
                      type="span"
                    />
                  </GIText>
                  <GIText
                    className="tac"
                    text="Add custom steps for your marketing campaign or follow existing ones with a pre-built template."
                    type="p"
                  />
                </GIContainer>
              </GIContainer>

              <Link
                className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 br32"
                to="/contact-us"
              >
                Book a Call
              </Link>
            </GIContainer>
            <TestimonyScroller />

            {context.ghostitBlogs.length !== 0 && (
              <GIContainer
                className={
                  "column full-center my64 " +
                  (isMobileOrTablet() ? "px16" : "px64")
                }
              >
                <GIText className="muli x-fill tac " type="h2">
                  Latest
                  <GIText
                    className="four-blue2 bold"
                    text=" Blog Posts"
                    type="span"
                  />
                </GIText>
                {context.ghostitBlogs.length !== 0 && (
                  <GIContainer
                    className={
                      "x-fill mt64 " +
                      (isMobileOrTablet()
                        ? "grid-200px grid-gap-16"
                        : "grid-300px grid-gap-32")
                    }
                  >
                    {context.ghostitBlogs.map((ghostitBlog, index) => {
                      if (index > 2) return;
                      else
                        return <Blog ghostitBlog={ghostitBlog} key={index} />;
                    })}
                  </GIContainer>
                )}
                <Link to="/blog">
                  <GIButton
                    className="bold bg-white common-border four-blue shadow-blue-2 br32 py16 px32 mt64"
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
export default RegularVersion;
