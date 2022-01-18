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
import { formSubmit } from "../../components/forms/AgencyForm/util";

class LandingPage1 extends Component {
  state = {
    email: "",
    name: ""
  };
  render() {
    const { email, name } = this.state;
    const { history } = this.props;

    return (
      <Consumer>
        {context => (
          <Page
            className="column"
            description="Organize your marketing process with an all-in-one marketing solution & agency for unified content development & promotion."
            homePage={true}
            keywords="content creators"
            title="Ghostit Content Agency"
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
                    <GIText
                      className="mb16"
                      text="Want a free non-bias opinion of your business’s online presence?"
                      type="h2"
                    />
                    <form
                      className="flex column justify-center"
                      onSubmit={e => {
                        e.preventDefault();
                        formSubmit({ fName: name, email }, history);
                      }}
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
                <GIText
                  className="muli four-blue mb16"
                  text="SEO Optimized Blogs."
                  type="h1"
                />
                <GIText
                  className="mb32"
                  text="Ensure your website has regular thought-provoking blog posts."
                  type="h4"
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
                  Written by People.
                  <GIText
                    className="four-blue"
                    text="&nbsp;Backed by Data."
                    type="span"
                  />
                </GIText>
                <GIText
                  className="mb32"
                  text="It’s not enough to just write a well-written blog post. You need metrics. You need analytics. You need to know the numbers attached to the keywords you are trying to rank for. From search volume to ranking difficulty. Don’t worry; our team has you covered."
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
                className="tac muli white mb32"
                text="Let’s talk about your online presence and how we can improve it!"
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
                    <GIText className="white" text="SEO Keywords" type="h4" />
                    <GIText
                      className="white"
                      text="What exactly is your audience typing into Google? Short-form keywords, long-form keywords, you need to know them all in order to rank for them."
                      type="p"
                    />
                  </GIContainer>
                  <GIContainer className="column mx8">
                    <GIContainer className="column container-box small bg-blue-fade-7 px32 py64 mb16 br8">
                      <GIText className="white" text="SEO Topics" type="h4" />
                      <GIText
                        className="white"
                        text="You need to know what keywords to rank for, but you ALSO need to know what topics your audience wants to read about. Keywords and topics go hand in hand. Nail the topic, and your website visitor is more likely to turn into a lead!"
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
                  How do we help our clients?
                </GIText>

                <GIText
                  className="mb32"
                  text="Ghostit is the blogging service you have been looking for. We take the guesswork out of what to write, when to write, how to write, and ensure your website’s blog is always full of content that leads your audience to you and makes your company stand out."
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

            <GIContainer className="full-center x-fill column pt64 pb4">
              <GIContainer className="column full-center container large">
                <GIText
                  className="muli mb8"
                  text="Become a Blogging Machine!"
                  type="h2"
                />
                <GIText
                  className="tac mb16"
                  text="We research evergreen content, trending topics, keywords, your competitors, and your audience to determine the best SEO-optimized blog strategy for your business."
                  type="h6"
                />
              </GIContainer>
            </GIContainer>
          </Page>
        )}
      </Consumer>
    );
  }
}
export default LandingPage1;
