import React, { Component } from "react";
import MetaTags from "react-meta-tags";

import "./style.css";

class PricingPage extends Component {
  render() {
    return (
      <div className="website-page flex column vc">
        <MetaTags>
          <title>Ghostit | Pricing</title>
          <meta
            name="description"
            content="Have questions? Give us a call: 250-415-3093"
          />
        </MetaTags>
        <h1 className="tac">Ghostit Pricing</h1>
        <h3 className="tac mx16">
          Have questions? Give us a call: 250-415-3093
        </h3>

        <div className="wrapping-container">
          <div className="container-box small common-shadow pa32 ma32">
            <div className="common-container colorful-bottom-border hc vc pa16 mb16">
              <h2 className="important-text">
                Professional
                <br />
                <span className="unimportant-text">$40</span>
                <span className="unimportant-text">/month</span>
              </h2>
            </div>
            <p className="unimportant-text pt8">
              Marketing campaign templates (custom or pre-built)
            </p>
            <p className="unimportant-text pt8">Custom workflows</p>
            <p className="unimportant-text pt8">Social scheduling</p>
            <p className="unimportant-text pt8">Task manager</p>
            <p className="unimportant-text pt8">Real-time multi-user</p>
          </div>

          <div className="container-box small common-shadow pa32 ma32">
            <div className="common-container colorful-bottom-border orange hc vc pa16 mb16">
              <h2 className="important-text">
                Agency
                <br />
                <span className="unimportant-text">
                  Plans starting at $300 / month
                </span>
              </h2>
            </div>
            <p className="unimportant-text pt8">Dedicated industry writer</p>
            <p className="unimportant-text pt8">Blog posts</p>
            <p className="unimportant-text pt8">Email newsletters</p>
            <p className="unimportant-text pt8">Social media posts</p>
            <p className="unimportant-text pt8">Keyword research</p>
            <p className="unimportant-text pt8">Competitive analysis</p>{" "}
          </div>

          <div className="container-box small common-shadow pa32 ma32">
            <div className="common-container colorful-bottom-border purple hc vc pa16 mb16">
              <h2 className="important-text">
                Enterprise
                <br />
                <span className="unimportant-text">Contact us for pricing</span>
              </h2>
            </div>
            <p className="unimportant-text pt8">Custom reporting</p>
            <p className="unimportant-text pt8">Custom feature-building</p>
            <p className="unimportant-text pt8">Custom Branding</p>
            <p className="unimportant-text pt8">
              In-depth competitive analysis
            </p>
            <p className="unimportant-text pt8">
              Marketing campaign templates (custom or pre-built)
            </p>
            <p className="unimportant-text pt8">Custom workflows</p>
            <p className="unimportant-text pt8">Social scheduling</p>
            <p className="unimportant-text pt8">Task manager</p>
          </div>
        </div>
      </div>
    );
  }
}

export default PricingPage;
