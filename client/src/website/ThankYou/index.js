import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-light-svg-icons/faCheck";

import { Link, withRouter } from "react-router-dom";

import GIContainer from "../../components/containers/GIContainer";
import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";

import Page from "../../components/containers/Page";

import { isMobileOrTablet } from "../../util";

class ThankYouPage extends Component {
  render() {
    return (
      <Page
        className="website-page align-center"
        description=""
        hideForm={true}
        keywords="content creators"
        title=""
      >
        <GIContainer
          className={`justify-center x-fill ${
            isMobileOrTablet() ? "column mb32 " : "reverse"
          }`}
          style={{ minHeight: "90vh" }}
        >
          {isMobileOrTablet() && (
            <img
              alt="blob"
              id="blob-under-login"
              src={require("../../svgs/blob-under-login.svg")}
              style={{ width: "95vw" }}
            />
          )}

          <GIContainer
            className={`column full-center px32 pb64 mb32 ${
              isMobileOrTablet() ? "x-fill pt64 " : "container-box extra-large"
            }`}
          >
            <GIText className="tac bold muli mb16" type="h2">
              Thank you for booking a call with us. We look forward to speaking
              with you and hopefully working together!
            </GIText>
            <GIText
              className="fs-18 tac mb32"
              text="Ghostit is an all-in-one content marketing solution that blends the benefits of real people with strategy-based technology. Our goal: to create compelling digital content that increases your web traffic and converts visitors into customers."
              type="h4"
            />
          </GIContainer>
        </GIContainer>
      </Page>
    );
  }
}

export default ThankYouPage;
