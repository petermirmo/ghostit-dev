import React, { Component } from "react";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

import HeaderSideBar from "../../navigations/HeaderSideBar";
import HeaderTopBar from "../../navigations/HeaderTopBar";
import SignedInAs from "../..//SignedInAs";

import WebsiteHeader from "../../navigations/WebsiteHeader";
import WebsiteFooter from "../../navigations/WebsiteFooter";
import GIContainer from "../GIContainer";

import { isUserInPlatform, shouldShowSignedInAsDiv } from "./util";
import { isMobileOrTablet } from "../../../util";

import "./style.css";

class Page extends Component {
  constructor(props) {
    super(props);
    const activePage = props.location.pathname;

    if (process.env.NODE_ENV !== "development")
      ReactGA.initialize("UA-121236003-1");

    if (!isUserInPlatform(activePage) && process.env.NODE_ENV !== "development")
      ReactGA.pageview(activePage);
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  checkPropsVariables = (activePage) => {
    const { testMode } = this.props; // Variables
    let { title, description, image, style } = this.props; // Variables

    if (!style) style = {};
    if (!title) title = "Ghostit Marketing Solution and Agency";
    if (!description)
      description =
        "Organize your marketing process with an all-in-one marketing solution & agency for unified content development & promotion.";
    if (!image)
      image =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1573309830/meta.png";
    if (testMode) style.backgroundColor = "blue";
    if (isUserInPlatform(activePage)) {
      style.backgroundImage = "linear-gradient(320deg, #246afb, #17bef8)";
      style.minWidth = "1000px";
    }

    return { style, title, description, image };
  };
  render() {
    const { children, className, homePage = true, location, user } = this.props; // Variables
    const activePage = location.pathname;

    const { style, title, description, image } = this.checkPropsVariables(
      activePage
    );

    return (
      <GIContainer className="screen-container" style={style}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`${title} | Ghostit`}</title>
          <meta name="title" content={`${title}`} />
          <meta name="og:title" content={`${title}`} />
          <meta name="description" content={description} />
          <meta name="og:description" content={description} />
          <meta property="image" content={image} />
          <meta property="og:image" content={image} />
        </Helmet>
        <GIContainer className="column x-fill">
          {isUserInPlatform(activePage) && <HeaderTopBar />}
          <GIContainer className="x-fill">
            {isUserInPlatform(activePage) && <HeaderSideBar />}

            <GIContainer className="column fill-flex">
              {!isUserInPlatform(activePage) && (
                <WebsiteHeader homePage={homePage} />
              )}

              <GIContainer
                className={
                  isUserInPlatform(activePage)
                    ? `page-container bg-white column ${className}`
                    : className
                }
              >
                {shouldShowSignedInAsDiv(activePage, user) && (
                  <SignedInAs user={user} />
                )}
                {children}
              </GIContainer>

              {!isUserInPlatform(activePage) && <WebsiteFooter />}
            </GIContainer>
          </GIContainer>
        </GIContainer>
      </GIContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}
export default withRouter(connect(mapStateToProps)(Page));
