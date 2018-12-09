import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
let { mobileAndTabletcheck } = require("../../componentFunctions");

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
    const { user } = this.props;
    let className = "transparent-button-important moving-border mr16";

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
      <div id="website-header">
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
            <Logo className="button" />
          </Link>
        </div>
        <Link to="/home">
          <button
            className={className + this.isActive("home") + this.isActive("")}
          >
            Home
          </button>
        </Link>
        <Link to="/team">
          <button className={className + this.isActive("team")}>Team</button>
        </Link>
        <Link to="/pricing">
          <button className={className + this.isActive("pricing")}>
            Pricing
          </button>
        </Link>
        <Link to="/agency">
          <button className={className + this.isActive("agency")}>
            Ghostit Agency
          </button>
        </Link>
        <Link to="/blog">
          <button className={className + this.isRootActive("blog")}>
            Blog
          </button>
        </Link>

        {user && (
          <Link to="/content">
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
            <button className={className + this.isActive("sign-up")}>
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
