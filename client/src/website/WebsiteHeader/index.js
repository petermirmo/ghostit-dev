import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Logo from "./Logo";

import "./style.css";

class WebsiteHeader extends Component {
  render() {
    const { user } = this.props;
    let className = "website-header-button moving-border px32";

    let activePage = "hello";

    return (
      <div className="website-header fixed flex pt16 px32">
        <div className="logo-container flex">
          <Link to="/home">
            <Logo style={{ cursor: "pointer" }} />
          </Link>
        </div>
        <Link to="/home">
          <button
            className={
              activePage === "home" || activePage === ""
                ? className + " active"
                : className
            }
          >
            Home
          </button>
        </Link>
        <Link to="/team">
          <button
            className={
              activePage === "team" ? className + " active" : className
            }
          >
            Team
          </button>
        </Link>
        <Link to="/pricing">
          <button
            className={
              activePage === "pricing" ? className + " active" : className
            }
          >
            Pricing
          </button>
        </Link>
        <Link to="/agency">
          <button
            className={
              activePage === "agency" ? className + " active" : className
            }
          >
            Ghostit Agency
          </button>
        </Link>
        <Link to="/blog">
          <button
            className={
              activePage === "blog" ? className + " active" : className
            }
          >
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
            <button
              className={
                activePage === "sign-in" ? className + " active" : className
              }
            >
              Sign In
            </button>
          </Link>
        )}
        {!user && (
          <Link to="/sign-up">
            <button
              className={
                activePage === "sign-up" ? className + " active" : className
              }
            >
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
export default connect(mapStateToProps)(WebsiteHeader);
