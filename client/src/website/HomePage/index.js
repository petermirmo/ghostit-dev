import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons/faTimes";

import Consumer from "../../context";

import Page from "../../components/containers/Page";
import Modal from "../../components/containers/Modal";
import GIContainer from "../../components/containers/GIContainer";
import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";

import Blog from "../BlogPage/Blog";
import AgencyForm from "../../components/forms/AgencyForm";
import TestimonyScroller from "./TestimonyScroller";

import { isMobileOrTablet } from "../../util";

import "./style.css";

class RegularVersion extends Component {
  state = {
    email: "",
    showModal: false,
    showThankYou: false,
    url: ""
  };
  componentDidMount() {
    setTimeout(() => {
      if (!localStorage.noFirstVisit) {
        this.setState({ showModal: true });
        localStorage.noFirstVisit = "1";
      }
    }, 10000);
  }
  render() {
    const { email, showModal, showThankYou, url } = this.state;

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
              className={`justify-center x-fill pb64 ${
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
                <GIText
                  className="bold primary-font tac muli mb16"
                  type="h1"
                  style={{ fontSize: "60px" }}
                >
                  Amplify Your Website Traffic and Turn Visitors Into Paying
                  Customers
                </GIText>
                <GIText
                  className="primary-font fs-20 tac mb32"
                  text="We are Your Growth-Focused Digital Marketing & Web Development Agency"
                  type="h2"
                />
                <Link
                  className="muli bold white bg-orange-fade-2 shadow-orange-3 px64 py16 mb8 "
                  style={{ fontSize: "30px", borderRadius: "64px" }}
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
            {showModal && (
              <Modal
                body={
                  showThankYou ? (
                    <GIContainer className="full-center column x-fill y-fill pa16">
                      <h4 className="fs-20 tac">
                        Expect to hear from us within one business day!
                        Meanwhile, keep browsing our website.
                      </h4>
                    </GIContainer>
                  ) : (
                    <GIContainer className="full-center column x-fill y-fill pa16">
                      <input
                        type="text"
                        className="x-fill pa8 mb16 br4"
                        placeholder="URL"
                        onChange={event =>
                          this.setState({ url: event.target.value })
                        }
                        value={url}
                      />
                      <input
                        type="text"
                        className="x-fill pa8 mb16 br4"
                        placeholder="Email"
                        onChange={event =>
                          this.setState({ email: event.target.value })
                        }
                        value={email}
                      />
                      <button
                        className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 mb8 br32"
                        onClick={() => {
                          const { email, url } = this.state;

                          if (!email || !url)
                            alert("Please fill out all fields!");

                          this.setState({ showModal: false });

                          axios
                            .post("/api/book-a-call", {
                              email,
                              url
                            })
                            .then(res => {
                              const { success } = res.data;

                              if (success) {
                                this.setState({ showThankYou: true });
                              } else {
                                alert(
                                  "Error - Your request was not successful, please email us directly at hello@ghostit.co."
                                );
                              }
                              console.log(success);
                            });
                        }}
                      >
                        Submit
                      </button>
                    </GIContainer>
                  )
                }
                close={() => this.setState({ showModal: false })}
                className="br8"
                header={
                  <GIContainer className="bg-seven-blue x-fill full-center py16">
                    <GIContainer className="flex-fill" />
                    <GIText
                      className="tac white"
                      text={
                        showThankYou
                          ? "Thank you!"
                          : "Would you like a free online presence audit?"
                      }
                      type="h2"
                    />
                    <GIContainer className="justify-end flex-fill px16">
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="opposite-button-colors clickable br4 round-icon-small"
                        onClick={() => this.setState({ showModal: false })}
                      />
                    </GIContainer>
                  </GIContainer>
                }
                showClose={false}
                style={{}}
              />
            )}
          </Page>
        )}
      </Consumer>
    );
  }
}
export default RegularVersion;
