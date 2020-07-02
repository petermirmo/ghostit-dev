import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-light-svg-icons/faCheck";

import { Link, withRouter } from "react-router-dom";

import GIContainer from "../../components/containers/GIContainer";
import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";

import Page from "../../components/containers/Page";

import { isMobileOrTablet } from "../../util";

class PricingPage extends Component {
  render() {
    return (
      <Page
        className="website-page align-center mt32"
        title="All-in-One Marketing Solution & Agency Pricing"
        description="Check out pricing for Ghostit marketing plans that all include dedicated content creators, competitive analysis, keyword research, and much more."
        keywords="content creators"
      >
        <GIContainer
          className={
            "column " + (isMobileOrTablet() ? "x-fill" : "container-box large")
          }
        >
          <GIText className="tac mb8" text="Pricing" type="h2">
            <GIText className="four-blue" text="Ghostit&nbsp;" type="span" />
          </GIText>
          <GIText className="tac mx16 mb32" type="h4">
            Have questions? Give us a call:
            <GIText
              className="four-blue"
              text="&nbsp;250-415-3093&nbsp;"
              type="span"
            />
            or email us at
            <a
              className="fs-20 no-bold"
              href="mailto:hello@ghostit.co?Subject=Hello%20Ghostit!"
            >
              &nbsp; hello@ghostit.co
            </a>
          </GIText>
        </GIContainer>
        <GIContainer className="column wrap justify-center align-end mt16 mb32">
          <GIContainer className="container-box medium column shadow-3 common-border one-blue mb32 mx16 br16">
            <GIContainer className="wrap x-fill full-center pa32">
              <GIContainer className="column">
                <GIText
                  className="fill-flex muli tac mb4"
                  text="Marketing Plans"
                  type="h2"
                />
                <GIText
                  className="fill-flex muli tac mb4"
                  text="Starting at"
                  type="h6"
                />
              </GIContainer>
              <GIContainer className="fill-flex full-center">
                <GIContainer className="xy-128px full-center column round bg-four-blue">
                  <GIText className="quicksand white" text="$540" type="h2" />
                  <GIText className="white" text="Per Month" type="h6" />
                </GIContainer>
              </GIContainer>
            </GIContainer>

            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Dedicated industry writer" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Blog posts" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Email newsletters" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Social media posts" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Keyword research" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Competitive analysis" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed border-bottom-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Custom graphics" type="p" />
            </GIContainer>
            <GIContainer className="x-fill full-center py16">
              <GIButton
                className="bg-orange-fade-2 white shadow-orange-2 py16 px32 br32"
                onClick={() =>
                  document.getElementById("contact-us-form").scrollIntoView()
                }
                text="Get Started Now!"
              />
            </GIContainer>
          </GIContainer>
        </GIContainer>
      </Page>
    );
  }
}

export default PricingPage;
