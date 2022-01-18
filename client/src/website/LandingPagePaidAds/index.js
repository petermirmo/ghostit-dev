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
                  text="Pay-Per-Click (PPC) Paid Marketing"
                  type="h1"
                />
                <GIText
                  className="mb32"
                  text="Get your business in front of your target audience quickly and effectively. With paid ads on search engines and social media platforms, we can drive traffic to your website right away."
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
                  Created by People.
                  <GIText
                    className="four-blue"
                    text="&nbsp;Backed by Data."
                    type="span"
                  />
                </GIText>
                <GIText
                  className="mb32"
                  text="It’s not enough to just put up a random Facebook Ad or Google Ads Campaign. You need metrics. You need analytics. You need to know where on the internet your customers are and what exactly they are looking for. From strategy to execution to management of your online ads, we’ve got you covered."
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
                    <GIText
                      className="white"
                      text="Search Engine Marketing (SEM)"
                      type="h4"
                    />
                    <GIText
                      className="white"
                      text="What exactly is your audience looking for on Google (or Bing!)? From figuring out keyword types, to bidding, to how to go head-to-head with your competitors in the high value search space, there is a lot of information to process before starting even the most basic of SEM campaigns."
                      type="p"
                    />
                  </GIContainer>
                  <GIContainer className="column mx8">
                    <GIContainer className="column container-box small bg-blue-fade-7 px32 py64 mb16 br8">
                      <GIText
                        className="white"
                        text="Social Media Marketing (SMM)"
                        type="h4"
                      />
                      <GIText
                        className="white"
                        text="What social media platforms do your customers spend time on? What are they interested in and how can you reach them when it matters? It takes time, effort, and specific know-how to figure this all out. Thankfully, Ghostit has the tools to find this information and more."
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
                  text="Ghostit is the Paid Ads Agency you have been looking for. We take the guesswork out of where to advertise and what to advertise. Ghostit generates quality traffic to your website and turns that traffic into leads. No more wasting valuable time and online advertising dollars."
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
                  text="Become an Online Advertising Machine!"
                  type="h2"
                />
                <GIText
                  className="tac mb16"
                  text="Ghostit stays on top of your audience. We find them, and make sure they know how great your company is. We can help you, contact us today!"
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
