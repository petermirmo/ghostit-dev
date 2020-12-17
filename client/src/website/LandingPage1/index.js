import React, { Component } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/pro-light-svg-icons/faArrowRight";
import { faQuoteLeft } from "@fortawesome/pro-light-svg-icons/faQuoteLeft";

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
                    : "container-box medium ov-visible"
                }`}
              >
                <GIContainer
                  className={`bg-orange-fade-4 column pt8 br8 ${
                    isMobileOrTablet() ? "x-85" : "x-fill"
                  }`}
                >
                  <GIContainer className="x-fill bg-white shadow-8 column pa32 br8">
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
                        className="bg-deep-blue shadow-deep-blue white px32 py16 br32"
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
                    ? "x-fill my64"
                    : "container-box medium align-start"
                }`}
              >
                <GIText className="muli" text="Create. Customize." type="h2" />
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
                <Link
                  className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb32 br32"
                  to="/contact-us"
                >
                  Book a Call
                </Link>
              </GIContainer>
            </GIContainer>

            <GIContainer
              className={`full-center x-fill  ${
                isMobileOrTablet() ? "column" : ""
              }`}
            >
              <GIContainer
                className={`${
                  isMobileOrTablet()
                    ? "relative x-fill full-center px32"
                    : "ov-visible relative container-box large"
                }`}
              >
                <img
                  alt=""
                  className={`${isMobileOrTablet() ? "x-85" : "fill-parent"}`}
                  src="https://res.cloudinary.com/ghostit-co/image/upload/v1577483032/group-5_3x.png"
                />
                <img
                  alt=""
                  className="absolute"
                  src={require("../../svgs/computer-analytics-bg.svg")}
                  style={{
                    height: "150%",
                    top: "-35%",
                    right: "30%",
                    zIndex: "-1"
                  }}
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
                <Link
                  className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb32 br32"
                  to="/contact-us"
                >
                  Book a Call
                </Link>
              </GIContainer>
            </GIContainer>

            <GIContainer className="column x-fill full-center bg-orange-fade py32">
              <GIText
                className="tac muli white"
                text="Top Secret to"
                type="h4"
              />
              <GIText
                className="tac muli white mb32"
                text="Social Media Marketing Success"
                type="h2"
              />
              <form
                action="https://ghostit.us14.list-manage.com/subscribe/post?u=6295bbe9fa9b4ee614df357c4&amp;id=aab772526a"
                className={`flex full-center container-box extra-large px16 ${
                  isMobileOrTablet() ? "wrap" : ""
                }`}
                method="post"
                name="m"
                target="_blank"
                noValidate
              >
                <GIInput
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="px16 py8 mx8 mb8 br20"
                  name="EMAIL"
                  onChange={e => {
                    this.setState({ email: e.target.value });
                  }}
                  placeholder="Email address"
                  type="email"
                  value={email}
                />
                <GIInput
                  className="px16 py8 mx8 mb8 br20"
                  onChange={e => {
                    this.setState({ name: e.target.value });
                  }}
                  placeholder="Name"
                  value={name}
                  type="text"
                />
                <GIButton
                  className="no-text-wrap bg-deep-blue shadow-deep-blue white px32 py16 mx8 br32"
                  name="subscribe"
                  type="submit"
                >
                  Get Your Free Report Now
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
                  isMobileOrTablet() ? "x-fill full-center px32" : ""
                }`}
              >
                <GIContainer
                  className={`relative x-fill full-center ${
                    isMobileOrTablet() ? "wrap" : ""
                  }`}
                >
                  <img
                    alt=""
                    className="absolute"
                    src={require("../../svgs/landing-page-bg.svg")}
                    style={{
                      height: "140%",
                      top: "0%",
                      right: "0%",
                      zIndex: "-1"
                    }}
                  />
                  <GIContainer className="column container-box small bg-blue-fade-7 px32 py64 mx8 mb16 br8">
                    <GIText
                      className="white"
                      text="Custom Workflows"
                      type="h4"
                    />
                    <GIText
                      className="white"
                      text="Map your marketing campaign from scratch or use pre-built templates."
                      type="p"
                    />
                  </GIContainer>
                  <GIContainer className="column mx8">
                    <GIContainer className="column container-box small bg-blue-fade-7 px32 py64 mb16 br8">
                      <GIText
                        className="white"
                        text="Post Instructions"
                        type="h4"
                      />
                      <GIText
                        className="white"
                        text="Add custom steps for your marketing campaign or follow existing ones with a pre-built template."
                        type="p"
                      />
                    </GIContainer>
                    <GIContainer className="column container-box small bg-blue-fade-7 px32 py64 br8">
                      <GIText
                        className="white"
                        text="Social Scheduling"
                        type="h4"
                      />
                      <GIText
                        className="white"
                        text="Sync all your social sharing accounts and post directly from our platform."
                        type="p"
                      />
                    </GIContainer>
                  </GIContainer>
                </GIContainer>
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
                  How we help our clients to measure thier
                  <GIText
                    className="four-blue"
                    text="&nbsp;Social Activites"
                    type="span"
                  />
                </GIText>

                <GIText
                  className="mb32"
                  text="Ghostit lets you map out marketing campaigns, assign instructions, and schedule your content directly from the platform so you can get more done in less time."
                  type="p"
                />
                <Link
                  className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb32 br32"
                  to="/contact-us"
                >
                  Book a Call
                </Link>
              </GIContainer>
            </GIContainer>

            <GIContainer
              className={`justify-center x-fill  py32 ${
                isMobileOrTablet() ? "column" : "my32"
              }`}
            >
              <GIContainer
                className={`${
                  isMobileOrTablet()
                    ? "relative x-fill full-center px32"
                    : "ov-visible relative container-box large"
                }`}
              >
                <img
                  alt=""
                  className="absolute"
                  src={require("../../svgs/reviews-bg.svg")}
                  style={{
                    height: "150%",
                    top: "-35%",
                    right: "30%",
                    zIndex: "-1"
                  }}
                />
              </GIContainer>
              <GIContainer
                className={`column px32 ${
                  isMobileOrTablet()
                    ? "x-fill full-center"
                    : "container-box medium align-start"
                }`}
              >
                <FontAwesomeIcon
                  className="grey-2"
                  icon={faQuoteLeft}
                  size="5x"
                />
                <GIText
                  className="muli italic mb32"
                  text="Repeatedly running digital campaigns for multiple clients can get both cumbersome and at times confusing. Ghostit's platform lets me schedule all of my client's marketing initiatives unlike any other platform and keep them all organized."
                  type="p"
                />
                <GIText
                  className="bold muli italic"
                  text="Sean Wiggins"
                  type="h5"
                />
                <GIText
                  className="muli italic"
                  text="North Digital Founder"
                  type="h6"
                />
              </GIContainer>
            </GIContainer>
            <GIContainer className="full-center x-fill column py64">
              <GIText
                className="muli mb8"
                text="Join the Social Revolution"
                type="h2"
              />
              <GIText
                className="mb16"
                text="Try GhostIt free for 14 days. No credit card needed."
                type="h6"
              />

              <Link
                className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb32 br32"
                to="/contact-us"
              >
                Book a Call
              </Link>
            </GIContainer>
          </Page>
        )}
      </Consumer>
    );
  }
}
export default LandingPage1;
