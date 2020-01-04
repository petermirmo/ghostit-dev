import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { isMobileOrTablet } from "../../../util";

import Logo from "./Logo";
import GIContainer from "../../containers/GIContainer";
import GIButton from "../../views/GIButton";
import GIText from "../../views/GIText";

import { getPostColor, getPostIconRound } from "../../../componentFunctions";

import "./styles";

class WebsiteHeader extends Component {
  state = {
    showHeader: !isMobileOrTablet()
  };
  componentDidMount() {
    // This is for header to blend with background when at top of home page
    this._ismounted = true;
  }
  componentWillUnmount() {
    this._ismounted = false;
  }

  changeState = (index, value) => {
    if (this._ismounted) this.setState({ [index]: value });
  };

  isActive = page => {
    if ("/" + page === this.props.location.pathname) return " four-blue";
    else return "";
  };
  isRootActive = page => {
    if (
      "/" + page ===
      this.props.location.pathname.substring(0, page.length + 1)
    )
      return " four-blue";
    else return "";
  };

  render() {
    const { showHeader } = this.state;
    const { homePage, user } = this.props;

    let trialButtonClassName = "regular-button";

    if (!showHeader) {
      return (
        <FontAwesomeIcon
          icon={faBars}
          id="mobile-open-header-button"
          onClick={() => this.setState({ showHeader: true })}
          size="2x"
        />
      );
    }

    return (
      <GIContainer className="website-header grid-3-column full-center common-transition pt32 pb8">
        {!isMobileOrTablet() && (
          <img
            alt="blob"
            id="blob-under-login"
            src={require("../../../svgs/blob-under-login.svg")}
            style={{ width: homePage ? "55vw" : "350px" }}
          />
        )}
        {!isMobileOrTablet() && !homePage && (
          <img
            alt="blob"
            id="small-star-circle-under-login"
            src={require("../../../svgs/circle-stars.svg")}
          />
        )}
        {!isMobileOrTablet() && !homePage && (
          <img
            alt="blob"
            id="medium-likes-circle-under-login"
            src={require("../../../svgs/circle-likes.svg")}
          />
        )}
        {isMobileOrTablet() && (
          <FontAwesomeIcon
            icon={faTimes}
            size="2x"
            className="close"
            onClick={() => this.setState({ showHeader: false })}
          />
        )}
        <GIContainer className="full-center">
          <Link to="/home">
            <Logo
              id="logo-container"
              onClick={
                isMobileOrTablet()
                  ? () => {
                      this.setState({ showHeader: false });
                    }
                  : () => {}
              }
              style={{ width: "10vw", minWidth: "115px" }}
            />
          </Link>
        </GIContainer>
        <GIContainer
          className={isMobileOrTablet() ? "full-center column" : "full-center"}
        >
          <Link to="/team">
            <button
              className={"relative pb8 mx8" + this.isActive("team")}
              onClick={
                isMobileOrTablet()
                  ? () => {
                      this.setState({ showHeader: false });
                    }
                  : () => {}
              }
            >
              {this.isActive("team") && <div className="border-bottom-50" />}
              Our Team
            </button>
          </Link>
          <Link to="/pricing">
            <button
              className={"relative pb8 mx8" + this.isActive("pricing")}
              onClick={
                isMobileOrTablet()
                  ? () => {
                      this.setState({ showHeader: false });
                    }
                  : () => {}
              }
            >
              {this.isActive("pricing") && <div className="border-bottom-50" />}
              Pricing
            </button>
          </Link>
          <Link to="/agency">
            <button
              className={"relative pb8 mx8" + this.isActive("agency")}
              onClick={
                isMobileOrTablet()
                  ? () => {
                      this.setState({ showHeader: false });
                    }
                  : () => {}
              }
            >
              {this.isActive("agency") && <div className="border-bottom-50" />}
              Ghostit Agency
            </button>
          </Link>
          <Link to="/blog">
            <button
              className={"relative pb8 mx8" + this.isRootActive("blog")}
              onClick={
                isMobileOrTablet()
                  ? () => {
                      this.setState({ showHeader: false });
                    }
                  : () => {}
              }
            >
              {this.isRootActive("blog") && (
                <div className="border-bottom-50" />
              )}
              Blog
            </button>
          </Link>
        </GIContainer>
        <GIContainer
          className={`justify-end align-center ${
            isMobileOrTablet() ? "column" : "mr32"
          }`}
        >
          <GIContainer className="x-wrap align-center my4">
            <a
              href="https://www.facebook.com/ghostitcontent/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="clickable common-border white round-icon round pa8 ml16"
                icon={getPostIconRound("facebook")}
                style={{
                  backgroundColor: isMobileOrTablet()
                    ? getPostColor("facebook")
                    : "transparent"
                }}
              />
            </a>

            <a
              href="https://twitter.com/ghostitcontent"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="clickable common-border white round-icon round pa8 ml16"
                icon={getPostIconRound("twitter")}
                style={{
                  backgroundColor: isMobileOrTablet()
                    ? getPostColor("twitter")
                    : "transparent"
                }}
              />
            </a>
            <a
              href="https://www.linkedin.com/company/ghostit-content/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="clickable common-border white round-icon round pa8 ml16"
                icon={getPostIconRound("linkedin")}
                style={{
                  backgroundColor: isMobileOrTablet()
                    ? getPostColor("linkedin")
                    : "transparent"
                }}
              />
            </a>
            <a
              href="https://www.instagram.com/ghostitcontent/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FontAwesomeIcon
                className="clickable common-border white round-icon round pa8 mx16"
                icon={getPostIconRound("instagram")}
                style={{
                  backgroundColor: isMobileOrTablet()
                    ? getPostColor("instagram")
                    : "transparent"
                }}
              />
            </a>
          </GIContainer>
          {!user && (
            <Link to="/sign-in">
              <GIButton
                className={`common-border br20 px16 py8 ${
                  isMobileOrTablet() ? "four-blue" : "white"
                }`}
                text="Sign In"
              />
            </Link>
          )}

          {user && (
            <Link to="/dashboard">
              <GIButton
                className={`common-border br20 px16 py8 ${
                  isMobileOrTablet() ? "four-blue" : "white"
                }`}
                text="Go to Software"
              />
            </Link>
          )}
        </GIContainer>
      </GIContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default withRouter(connect(mapStateToProps)(WebsiteHeader));
