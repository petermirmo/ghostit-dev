import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faFacebook from "@fortawesome/fontawesome-free-brands/faFacebookSquare";
import faTwitter from "@fortawesome/fontawesome-free-brands/faTwitterSquare";
import faLinkedin from "@fortawesome/fontawesome-free-brands/faLinkedin";
import faInstagram from "@fortawesome/fontawesome-free-brands/faInstagram";
import { getPostColor } from "../../../componentFunctions";

import "./style.css";

class WebsiteFooter extends Component {
  isActive = activePage => {
    if ("/" + activePage == this.props.location.pathname) return " active";
    else return "";
  };
  render() {
    return (
      <div className="simple-container">
        <div className="wrapping-container-no-center px32">
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
            <Link to="/team">
              <button
                className={"transparent-button mt8" + this.isActive("team")}
              >
                Ghostit Team
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
        <div className="wrapping-container px32">
          <a href="https://www.facebook.com/ghostitcontent/" target="_blank">
            <FontAwesomeIcon
              icon={faFacebook}
              size="2x"
              style={{ color: "#4267b2" }}
              className="button mb16"
            />
          </a>

          <a href="https://twitter.com/ghostitcontent" target="_blank">
            <FontAwesomeIcon
              icon={faTwitter}
              size="2x"
              style={{ color: "#1da1f2" }}
              className="button ml16 mb16"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/ghostit-content/"
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faLinkedin}
              size="2x"
              style={{ color: "#0077b5" }}
              className="button ml16 mb16"
            />
          </a>
          <a href="https://www.instagram.com/ghostitcontent/" target="_blank">
            <FontAwesomeIcon
              icon={faInstagram}
              size="2x"
              style={{ color: "#cd486b" }}
              className="button ml16 mb16"
            />
          </a>
        </div>
      </div>
    );
  }
}

export default withRouter(WebsiteFooter);
