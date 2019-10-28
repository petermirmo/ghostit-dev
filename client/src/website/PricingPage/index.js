import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-light-svg-icons/faCheck";

import { Link, withRouter } from "react-router-dom";

import AgencyForm from "../../components/forms/AgencyForm";

import GIContainer from "../../components/containers/GIContainer";
import GIButton from "../../components/views/GIButton";
import GIText from "../../components/views/GIText";

import Page from "../../components/containers/Page";

import { isMobileOrTablet } from "../../util";

class PricingPage extends Component {
  state = {
    displayForm: false
  };
  render() {
    const { displayForm } = this.state;
    return (
      <Page
        className="website-page align-center mt32"
        title="Pricing"
        description="Have questions? Give us a call: 250-415-3093"
        keywords="ghostit, pricing"
      >
        <GIText className="tac mb8" text="Pricing" type="h2">
          <GIText className="four-blue" text="Ghostit&nbsp;" type="span" />
        </GIText>
        <GIText className="tac mx16 mb32" type="h6">
          Have questions? Give us a call:
          <GIText className="four-blue" text="&nbsp;250-415-3093" type="span" />
        </GIText>
        <GIContainer className="x-wrap justify-center align-end mt16 mb32">
          <GIContainer className="container-box small column shadow-3 common-border one-blue mb32 mx16 br16">
            <GIContainer className="x-wrap x-fill full-center py32 px16">
              <GIText
                className="fill-flex muli tac mb4"
                text="Starter"
                type="h2"
              />
              <GIContainer className="fill-flex full-center">
                <GIContainer className="xy-128px full-center round common-border four-blue">
                  <GIText className="muli" text="FREE" type="h1" />
                </GIContainer>
              </GIContainer>
            </GIContainer>

            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText
                text="Marketing campaign templates (custom or pre-built)"
                type="p"
              />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Custom workflows" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Social scheduling" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Task manager" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Real-time multi-user" type="p" />
            </GIContainer>
            <GIContainer className="align-center border-top-dashed border-bottom-dashed px32 py16">
              <FontAwesomeIcon className="four-blue mr16" icon={faCheck} />
              <GIText text="Advanced analytics" type="p" />
            </GIContainer>
            <GIContainer className="x-fill full-center py16">
              <Link to="/sign-up">
                <GIButton
                  className="bg-blue-fade white shadow-blue py16 px32 br32"
                  text="Get Started Now!"
                />
              </Link>
            </GIContainer>
          </GIContainer>

          <GIContainer className="container-box small column shadow-3 common-border one-blue mb32 mx16 br16">
            <GIContainer className="x-wrap x-fill full-center py32 px16">
              <GIContainer className="column">
                <GIText
                  className="fill-flex muli tac mb4"
                  text="Agency"
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
                  <GIText className="quicksand white" text="$300" type="h2" />
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
            <GIContainer className="align-center border-top-dashed border-bottom-dashed px32 py16">
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
                onClick={() => {
                  this.setState({ displayForm: true });
                  window.setTimeout(() => {
                    document.getElementById("sign-up-form").scrollIntoView();
                  }, 10);
                }}
                text="Get Started Now!"
              />
            </GIContainer>
          </GIContainer>
        </GIContainer>
        {displayForm && (
          <GIContainer className="x-fill" id="sign-up-form">
            <AgencyForm />
          </GIContainer>
        )}
      </Page>
    );
  }
}

export default PricingPage;
