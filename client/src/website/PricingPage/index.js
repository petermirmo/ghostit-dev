import React, { Component } from "react";

import Page from "../../components/containers/Page";

class PricingPage extends Component {
  render() {
    return (
      <Page
        className="flex column vc website-page"
        title="Pricing"
        description="Have questions? Give us a call: 250-415-3093"
        keywords="ghostit, pricing"
      >
        <h1 className="tac">Ghostit Pricing</h1>
        <h4 className="tac mx16 ">
          Have questions? Give us a call: 250-415-3093
        </h4>

        <div className="wrapping-container">
          <div className="container-box small common-shadow pa32 ma32 br4">
            <div className="common-container colorful-bottom-border hc vc pa16 mb16">
              <h2 className="important-text mb4">Professional</h2>
              <h6 className="tac">$40 / month</h6>
            </div>
            <p className="pt8">
              Marketing campaign templates (custom or pre-built)
            </p>
            <p className="pt8">Custom workflows</p>
            <p className="pt8">Social scheduling</p>
            <p className="pt8">Task manager</p>
            <p className="pt8">Real-time multi-user</p>
          </div>

          <div className="container-box small common-shadow pa32 ma32 br4">
            <div className="common-container colorful-bottom-border orange hc vc pa16 mb16">
              <h2 className="important-text mb4">
                Agency
                <br />
              </h2>
              <h6 className="tac">Plans starting at $300 / month</h6>
            </div>
            <p className="pt8">Dedicated industry writer</p>
            <p className="pt8">Blog posts</p>
            <p className="pt8">Email newsletters</p>
            <p className="pt8">Social media posts</p>
            <p className="pt8">Keyword research</p>
            <p className="pt8">Competitive analysis</p>{" "}
          </div>

          <div className="container-box small common-shadow pa32 ma32 br4">
            <div
              className="common-container colorful-bottom-border hc vc pa16 mb16"
              style={{ borderColor: "var(--five-purple-color)" }}
            >
              <h2 className="important-text mb4">Enterprise</h2>
              <h6 className="tac">Contact us for pricing </h6>
            </div>
            <p className="pt8">Custom reporting</p>
            <p className="pt8">Custom feature-building</p>
            <p className="pt8">Custom Branding</p>
            <p className="pt8">In-depth competitive analysis</p>
            <p className="pt8">
              Marketing campaign templates (custom or pre-built)
            </p>
            <p className="pt8">Custom workflows</p>
            <p className="pt8">Social scheduling</p>
            <p className="pt8">Task manager</p>
          </div>
        </div>
      </Page>
    );
  }
}

export default PricingPage;
