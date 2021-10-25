import React from "react";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/pro-solid-svg-icons/faDollarSign";
import { faBrowser } from "@fortawesome/pro-solid-svg-icons/faBrowser";

import GIContainer from "../../../components/containers/GIContainer";
import GIText from "../../../components/views/GIText";

import { isMobileOrTablet } from "../../../util";

function ServicesNavigation() {
  return (
    <GIContainer className="column container extra-large full-center mb32">
      <GIText className="fs-26 mb16" text="Other Services" type="h3" />

      <GIContainer className="full-center wrap gap8">
        <GIContainer className="wrap gap8">
          <Link
            className="flex full-center column shadow-3 bg-white pa32 br16"
            to="/services/seo-blog-posts"
          >
            <GIContainer className="round-icon-large full-center common-border four-blue bg-white round mb8">
              <img
                alt=""
                className="x-50"
                src={require("../../../svgs/agency-edit.svg")}
              />
            </GIContainer>
            <GIText
              className="muli"
              text="SEO Optimized Blog Posts"
              type="h6"
            />
          </Link>
          <Link
            className="flex full-center column shadow-3 bg-white pa32 br16"
            to="/services/social-media-posts"
          >
            <GIContainer className="round-icon-large full-center common-border four-blue bg-white round mb8">
              <img
                alt=""
                className="x-50"
                src={require("../../../svgs/agency-thumbs-up.svg")}
              />
            </GIContainer>
            <GIText className="muli" text="Social Media Posts" type="h6" />
          </Link>
          <Link
            className="flex full-center column shadow-3 bg-white pa32 br16"
            to="/services/paid-advertising"
          >
            <GIContainer className="round-icon-large full-center common-border four-blue bg-white round mb8">
              <FontAwesomeIcon className="" icon={faDollarSign} size="2x" />
            </GIContainer>
            <GIText className="muli" text="Paid Advertising" type="h6" />
          </Link>
          <Link
            className="flex full-center column shadow-3 bg-white pa32 br16"
            to="/services/email-newsletter"
          >
            <GIContainer className="round-icon-large full-center common-border four-blue bg-white round mb8">
              <img
                alt=""
                className="x-50"
                src={require("../../../svgs/agency-email.svg")}
              />
            </GIContainer>
            <GIText className="muli" text="Email Newsletters" type="h6" />
          </Link>
        </GIContainer>
        <GIContainer className="wrap gap8">
          <Link
            className="flex full-center column shadow-3 bg-white pa32 br16"
            to="/services/web-content"
          >
            <GIContainer className="round-icon-large full-center common-border four-blue bg-red round">
              <img
                alt=""
                className="x-50"
                src={require("../../../svgs/agency-web.svg")}
              />
            </GIContainer>
            <GIText className="muli" text="Web Content" type="h6" />
          </Link>
          <Link
            className="flex full-center column shadow-3 bg-white pa32 br16"
            to="/services/website-design-and-development"
          >
            <GIContainer className="round-icon-large full-center common-border four-blue bg-white round mb8">
              <FontAwesomeIcon icon={faBrowser} size="2x" />
            </GIContainer>
            <GIText
              className="muli"
              text="Website Design & Development"
              type="h6"
            />
          </Link>
          <Link
            className="flex full-center column shadow-3 bg-white pa32 br16"
            to="/services/lead-generation-e-book"
          >
            <GIContainer className="round-icon-large full-center common-border four-blue bg-white round mb8">
              <img
                alt=""
                className="x-50"
                src={require("../../../svgs/agency-book.svg")}
              />
            </GIContainer>
            <GIText className="muli" text="Lead Generation E-Books" type="h6" />
          </Link>
        </GIContainer>
      </GIContainer>
    </GIContainer>
  );
}

export default ServicesNavigation;
