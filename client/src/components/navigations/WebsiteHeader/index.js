import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { mobileAndTabletcheck } from "../../../componentFunctions";

import Logo from "./Logo";

import "./styles";

class WebsiteHeader extends Component {
  state = {
    showHeader: !mobileAndTabletcheck()
  };
  isActive = page => {
    if ("/" + page === this.props.location.pathname) return " active";
    else return "";
  };
  isRootActive = page => {
    if (
      "/" + page ===
      this.props.location.pathname.substring(0, page.length + 1)
    )
      return " active";
    else return "";
  };
  render() {
    const { showHeader } = this.state;
    const { user, blendWithHomePage } = this.props;

    let className = "transparent-button-important moving-border mr16 pt8";
    let trialButtonClassName = "regular-button";

    if (blendWithHomePage) {
      className += " home white";
      trialButtonClassName += " purple";
    }

    if (!showHeader) {
      return (
        <FontAwesomeIcon
          icon={faBars}
          id="mobile-open-header-button"
          size="2x"
          onClick={() => this.setState({ showHeader: true })}
        />
      );
    }

    return (
      <div
        id="website-header"
        style={{
          backgroundColor: blendWithHomePage
            ? "transparent"
            : "var(--white-theme-color)"
        }}
      >
        {mobileAndTabletcheck() && (
          <FontAwesomeIcon
            icon={faTimes}
            size="2x"
            className="close"
            onClick={() => this.setState({ showHeader: false })}
          />
        )}
        <div id="logo-container">
          <Link to="/home">
            <Logo
              className="button"
              onClick={
                mobileAndTabletcheck()
                  ? () => {
                      this.setState({ showHeader: false });
                    }
                  : () => {}
              }
            />
          </Link>
        </div>
        <Link to="/home">
          <button
            className={className + this.isActive("home") + this.isActive("")}
            onClick={
              mobileAndTabletcheck()
                ? () => {
                    this.setState({ showHeader: false });
                  }
                : () => {}
            }
          >
            Home
          </button>
        </Link>
        <Link to="/team">
          <button
            className={className + this.isActive("team")}
            onClick={
              mobileAndTabletcheck()
                ? () => {
                    this.setState({ showHeader: false });
                  }
                : () => {}
            }
          >
            Team
          </button>
        </Link>
        <Link to="/pricing">
          <button
            className={className + this.isActive("pricing")}
            onClick={
              mobileAndTabletcheck()
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
            className={className + this.isActive("agency")}
            onClick={
              mobileAndTabletcheck()
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
            className={className + this.isRootActive("blog")}
            onClick={
              mobileAndTabletcheck()
                ? () => {
                    this.setState({ showHeader: false });
                  }
                : () => {}
            }
          >
            Blog
          </button>
        </Link>

        {user && (
          <Link to="/calendar">
            <button className={className}>Go to Software</button>
          </Link>
        )}
        {!user && (
          <Link to="/sign-in">
            <button className={className + this.isActive("sign-in")}>
              Sign In
            </button>
          </Link>
        )}
        {!user && (
          <Link to="/sign-up">
            <button className={trialButtonClassName + this.isActive("sign-up")}>
              Start Your Free Trial
            </button>
          </Link>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default withRouter(connect(mapStateToProps)(WebsiteHeader));
