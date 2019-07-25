import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { mobileAndTabletcheck } from "../../../componentFunctions";

import Logo from "./Logo";
import GIContainer from "../../containers/GIContainer";
import GIButton from "../../views/GIButton";

import "./styles";

class WebsiteHeader extends Component {
  state = {
    showHeader: !mobileAndTabletcheck(),
    headerAtTop: true
  };
  componentDidMount() {
    // This is for header to blend with background when at top of home page
    this._ismounted = true;
    window.onscroll = e => {
      if (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      )
        this.changeState("headerAtTop", false);
      else {
        if (!mobileAndTabletcheck()) this.changeState("headerAtTop", true);
      }
    };
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
    const { headerAtTop, showHeader } = this.state;
    const { user } = this.props;

    let headerButtonClassName = "mr16";
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
      <div
        className={
          headerAtTop
            ? "flex full-center common-transition pt32 pb8"
            : "flex full-center common-transition bg-white pt32 pb8"
        }
        id="website-header"
      >
        {mobileAndTabletcheck() && (
          <FontAwesomeIcon
            icon={faTimes}
            size="2x"
            className="close"
            onClick={() => this.setState({ showHeader: false })}
          />
        )}
        <GIContainer className="full-center fill-flex">
          <Link to="/home">
            <Logo
              id="logo-container"
              onClick={
                mobileAndTabletcheck()
                  ? () => {
                      this.setState({ showHeader: false });
                    }
                  : () => {}
              }
            />
          </Link>
        </GIContainer>
        <Link to="/team">
          <button
            className={headerButtonClassName + this.isActive("team")}
            onClick={
              mobileAndTabletcheck()
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
            className={headerButtonClassName + this.isActive("pricing")}
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
            className={headerButtonClassName + this.isActive("agency")}
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
            className={headerButtonClassName + this.isRootActive("blog")}
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
          <Link to="/dashboard">
            <button className={headerButtonClassName}>Go to Software</button>
          </Link>
        )}
        {!user && (
          <GIContainer className="fill-flex justify-end align-center">
            <Link to="/sign-in">
              <GIButton
                className={
                  headerAtTop
                    ? `${headerButtonClassName} ${this.isActive(
                        "sign-in"
                      )} common-border white mr16 br20`
                    : `${headerButtonClassName} ${this.isActive(
                        "sign-in"
                      )} common-border font-color px16 py8 mr16 br20`
                }
                text="login"
              />
            </Link>
          </GIContainer>
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
