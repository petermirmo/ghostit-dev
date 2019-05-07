import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faFacebook from "@fortawesome/fontawesome-free-brands/faFacebookSquare";
import faTwitter from "@fortawesome/fontawesome-free-brands/faTwitterSquare";
import faLinkedin from "@fortawesome/fontawesome-free-brands/faLinkedin";
import faInstagram from "@fortawesome/fontawesome-free-brands/faInstagram";

import GIContainer from "../../containers/GIContainer";
import GIText from "../../views/GIText";
import EmailForm from "../../forms/EmailForm";

class WebsiteFooter extends Component {
  isActive = activePage => {
    if ("/" + activePage === this.props.location.pathname) return " active";
    else return "";
  };
  render() {
    return (
      <GIContainer
        className="column x-fill"
        style={{ backgroundColor: "var(--seven-blue-color)" }}
      >
        <GIContainer className="x-wrap px32">
          <div className="container-box column tiny my16">
            <GIText className="white mb16" type="h6" text="Resources" />
            <Link to="/home">
              <GIText
                className={"white clickable my4" + this.isActive("home")}
                text="Home"
                type="h6"
              />
            </Link>
            <Link to="/pricing">
              <GIText
                className={"white clickable my4" + this.isActive("pricing")}
                text="Pricing"
                type="h6"
              />
            </Link>
            <Link to="/agency">
              <GIText
                className={"white clickable my4" + this.isActive("agency")}
                text="Ghostit Agency"
                type="h6"
              />
            </Link>

            <Link to="/blog">
              <GIText
                className={"white clickable my4" + this.isActive("blog")}
                text="Ghostit Blog"
                type="h6"
              />
            </Link>
            <Link to="/team">
              <GIText
                className={"white clickable my4" + this.isActive("team")}
                text="Ghostit Team"
                type="h6"
              />
            </Link>
          </div>
          <div className="container-box column tiny my16">
            <GIText
              className="white mb16"
              type="h6"
              text="Terms & Privacy"
              type="h6"
            />

            <Link to="/terms-of-service">
              <GIText
                className={
                  "white clickable my4" + this.isActive("terms-of-service")
                }
                text="Terms & Conditions"
                type="h6"
              />
            </Link>
            <Link to="/privacy-policy">
              <GIText
                className={
                  "white clickable my4" + this.isActive("privacy-policy")
                }
                text="Privacy Policy"
                type="h6"
              />
            </Link>
          </div>
          <div className="container-box column tiny my16">
            <GIText className="white mb16" type="h6" text="Contact Us" />
            <GIText className="white my4" type="h6" text="250-415-3093" />
            <GIText className="white my4" type="h6" text="hello@ghostit.co" />
          </div>
          <div className="container-box column tiny my16">
            <GIText
              className="white mb16"
              type="h6"
              text="Subscribe To Our Newsletter"
            />
            <EmailForm />
          </div>
        </GIContainer>
        <GIContainer className="x-wrap full-center px32">
          <a
            href="https://www.facebook.com/ghostitcontent/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faFacebook}
              size="2x"
              style={{ color: "white" }}
              className="clickable mb16"
            />
          </a>

          <a
            href="https://twitter.com/ghostitcontent"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faTwitter}
              size="2x"
              style={{ color: "white" }}
              className="clickable ml16 mb16"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/ghostit-content/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faLinkedin}
              size="2x"
              style={{ color: "white" }}
              className="clickable ml16 mb16"
            />
          </a>
          <a
            href="https://www.instagram.com/ghostitcontent/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faInstagram}
              size="2x"
              style={{ color: "white" }}
              className="clickable ml16 mb16"
            />
          </a>
        </GIContainer>
      </GIContainer>
    );
  }
}

export default withRouter(WebsiteFooter);
