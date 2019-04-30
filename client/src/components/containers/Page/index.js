import React, { Component, createContext } from "react";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga";
import { SizeMe } from "react-sizeme";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

import Header from "../../navigations/Header";
import SignedInAs from "../..//SignedInAs";

import WebsiteHeader from "../../navigations/WebsiteHeader";
import WebsiteFooter from "../../navigations/WebsiteFooter";
import GIContainer from "../GIContainer";

import { isUserInPlatform, shouldShowSignedInAsDiv } from "./util";

import "./style.css";

class Page extends Component {
  state = {
    headerWidth: 0
  };
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

  onSize = sizeChangeObj => {
    this.setState({ headerWidth: sizeChangeObj.width });
  };

  websiteOrSoftwareHeader = (activePage, blendWithHomePage) => {
    if (!isUserInPlatform(activePage))
      return <WebsiteHeader blendWithHomePage={blendWithHomePage} />;
    else return <Header onSize={this.onSize} />;
  };
  checkPropsVariables = activePage => {
    const { testMode } = this.props; // Variables
    let { title, description, image, style } = this.props; // Variables
    let { headerWidth } = this.state; // Variables

    if (!style) style = {};
    if (!title) title = "All In One Marketing Solution";
    if (!description)
      description =
        "Organize your marketing process with an all-in-one solution for unified content promotion.";
    if (!image)
      image =
        "https://res.cloudinary.com/ghostit-co/image/upload/v1544991863/ghost.png";
    if (testMode) style.backgroundColor = "blue";

    if (!isUserInPlatform(activePage)) headerWidth = 0;
    style.marginLeft = headerWidth;

    return { style, title, description, image };
  };
  render() {
    const { children, className, user, blendWithHomePage } = this.props; // Variables
    const activePage = location.pathname;

    const { style, title, description, image } = this.checkPropsVariables(
      activePage
    );

    return (
      <div className="page-container" style={style}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`${title} | Ghostit`}</title>
          <meta name="description" content={description} />
          <meta property="image" content={image} />
          <meta property="og:image" content={image} />
        </Helmet>
        {this.websiteOrSoftwareHeader(activePage, blendWithHomePage)}
        {shouldShowSignedInAsDiv(user, activePage) && (
          <SignedInAs user={user} />
        )}
        <GIContainer className={className}>{children}</GIContainer>
        {!isUserInPlatform(activePage) && <WebsiteFooter />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default withRouter(connect(mapStateToProps)(Page));
