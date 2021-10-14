import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-light-svg-icons/faCheck";

import { Link, withRouter } from "react-router-dom";

import GIContainer from "../../components/containers/GIContainer";
import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";

import Page from "../../components/containers/Page";

import { isMobileOrTablet } from "../../util";
/*
<GIText
  className={"tac px32 " + (isMobileOrTablet() ? "mb32" : "mb64")}
  text="Increase the amount of qualified traffic to your site."
  type="h4"
/>*/

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
          <GIText
            className={"tac px32 " + (isMobileOrTablet() ? "mb32" : "mb64")}
            type="h2"
          >
            Content Marketing Plans For
          </GIText>
        </GIContainer>
        <GIContainer className="wrap justify-center mb32">
          <GIContainer className="bg-white container-box medium column shadow-3 common-border one-blue mb32 mx16 br16">
            <GIContainer className="flex-fill wrap x-fill full-center pa32">
              <GIContainer className="column flex-fill">
                <GIText
                  className="flex-fill muli tac mb4"
                  text="Small to Medium-Sized Businesses"
                  type="h2"
                />
                <GIText
                  className="flex-fill muli tac mb4"
                  text="Starting at"
                  type="h6"
                />
              </GIContainer>
              <GIContainer className="full-center">
                <GIContainer className="xy-128px full-center column round bg-four-blue">
                  <GIText className="quicksand white" text="$700" type="h2" />
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
              <GIText text="SEO Blog posts" type="p" />
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
              <GIText
                text="Ad Spend Management across all ad networks"
                type="p"
              />
            </GIContainer>
            <GIContainer className="x-fill full-center py16">
              <Link
                className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 br32"
                to="/contact-us"
              >
                Book a Call
              </Link>
            </GIContainer>
          </GIContainer>
          <GIContainer className="bg-white container-box medium column shadow-3 common-border one-blue mb32 mx16 br16">
            <GIContainer className="flex-fill flex-fill wrap x-fill full-center pa32">
              <GIContainer className="column flex-fill">
                <GIText
                  className="flex-fill muli tac mb4"
                  text="Enterprise & Large Businesses"
                  type="h2"
                />
                <GIText
                  className="flex-fill muli tac mb4"
                  text="Prices based on requirements"
                  type="h6"
                />
              </GIContainer>
            </GIContainer>

            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Same features as SMB plans, and" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Existing content auditing/editing" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Coordination w/ your internal teams" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText
                text="Integration with any specific or proprietary technologies"
                type="p"
              />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Lead nurturing" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed border-bottom-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Custom web and software development" type="p" />
            </GIContainer>

            <GIContainer className="x-fill full-center py16">
              <Link
                className="no-bold white bg-orange-fade-2 shadow-orange-3 px32 py16 br32"
                to="/contact-us"
              >
                Book a Call
              </Link>
            </GIContainer>
          </GIContainer>
        </GIContainer>
      </Page>
    );
  }
}

export default PricingPage;
