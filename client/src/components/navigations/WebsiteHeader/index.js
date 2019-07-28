import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { isMobileOrTablet } from "../../../componentFunctions";

import Logo from "./Logo";
import GIContainer from "../../containers/GIContainer";
import GIButton from "../../views/GIButton";

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
    const { user } = this.props;

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
      <GIContainer className="website-header full-center common-transition pt32 pb8">
        {!isMobileOrTablet() && (
          <img
            alt="blob"
            id="blob-under-login"
            src={require("../../../svgs/blob-under-login.svg")}
          />
        )}
        {!isMobileOrTablet() && (
          <img
            alt="blob"
            id="small-star-circle-under-login"
            src={require("../../../svgs/circle-stars.svg")}
          />
        )}
        {!isMobileOrTablet() && (
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
            />
          </Link>
        </GIContainer>
        <GIContainer
          className={isMobileOrTablet() ? "full-center column" : "full-center"}
        >
          <Link to="/team">
            <button
              className={"mr16" + this.isActive("team")}
              onClick={
                isMobileOrTablet()
                  ? () => {
                      this.setState({ showHeader: false });
                    }
                  : () => {}
              }
            >
              Our Team
            </button>
          </Link>
          <Link to="/pricing">
            <button
              className={"mr16" + this.isActive("pricing")}
              onClick={
                isMobileOrTablet()
                  ? () => {
                      this.setState({ showHeader: false });
                    }
                  : () => {}
              }
            >
              Pricing
            </button>
          </Link>
          <Link to="/agency">
            <button
              className={"mr16" + this.isActive("agency")}
              onClick={
                isMobileOrTablet()
                  ? () => {
                      this.setState({ showHeader: false });
                    }
                  : () => {}
              }
            >
              Ghostit Agency
            </button>
          </Link>
          <Link to="/blog">
            <button
              className={"mr16" + this.isRootActive("blog")}
              onClick={
                isMobileOrTablet()
                  ? () => {
                      this.setState({ showHeader: false });
                    }
                  : () => {}
              }
            >
              Blog
            </button>
          </Link>
        </GIContainer>
        <GIContainer className="justify-end align-center mr32">
          {!user && (
            <Link to="/sign-in">
              <GIButton
                className="common-border white br20  px16 py8"
                text="login"
              />
            </Link>
          )}

          {user && (
            <Link to="/dashboard">
              <GIButton
                className="common-border white br20 px16 py8"
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
