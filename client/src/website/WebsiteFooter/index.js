import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import "./style.css";

class WebsiteFooter extends Component {
  isActive = activePage => {
    if ("/" + activePage == this.props.location.pathname) return " active";
    else return "";
  };
  render() {
    return (
      <div className="wrapping-container-no-center px32 border-top">
        <div className="container-box tiny my16">
          <h4 className="unimportant-text mb8">Resources</h4>
          <Link to="/home">
            <button
              className={"transparent-button mt8" + this.isActive("home")}
            >
              Home
            </button>
          </Link>
          <Link to="/pricing">
            <button
              className={"transparent-button mt8" + this.isActive("pricing")}
            >
              Pricing
            </button>
          </Link>
          <Link to="/agency">
            <button
              className={"transparent-button mt8" + this.isActive("agency")}
            >
              Agency Process
            </button>
          </Link>
          <Link to="/blog">
            <button
              className={"transparent-button mt8" + this.isActive("blog")}
            >
              Ghostit Blog
            </button>
          </Link>
        </div>
        <div className="container-box tiny my16">
          <h4 className="unimportant-text mb8">Terms & Privacy</h4>
          <Link to="/terms-of-service">
            <button
              className={
                "transparent-button mt8" + this.isActive("terms-of-service")
              }
            >
              Terms & Conditions
            </button>
          </Link>
          <Link to="/privacy-policy">
            <button
              className={
                "transparent-button mt8" + this.isActive("privacy-policy")
              }
            >
              Privacy Policy
            </button>
          </Link>
        </div>
        <div className="container-box tiny my16">
          <h4 className="unimportant-text mb8">Contact Us</h4>
          <p className="unimportant-text mt8">250-415-3093</p>
          <p className="unimportant-text mt8">hello@ghostit.co</p>
        </div>
      </div>
    );
  }
}

export default withRouter(WebsiteFooter);
