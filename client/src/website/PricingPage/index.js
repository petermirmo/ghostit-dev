import React, { Component } from "react";

import "./style.css";

class PricingPage extends Component {
  render() {
    return (
      <div className="website-page flex column vc">
        <h1 className="silly-font pb16 tac">Ghostit Pricing</h1>

        <div className="pricing-plans-container">
          <div className="pricing-plan-container common-shadow flex column pa32 ma32">
            <div className="plan-price-container blue flex column hc vc pa16 mb16">
              <h2 className="price-important">
                Professional
                <br />
                <span className="price-unimportant">$40</span>
                <span className="price-unimportant">/month</span>
              </h2>
            </div>
            <p className="width100 feature pt8">
              Marketing campaign templates (custom or pre-built)
            </p>
            <p className="width100 feature pt8">Custom workflows</p>
            <p className="width100 feature pt8">Social scheduling</p>
            <p className="width100 feature pt8">Task manager</p>
            <p className="width100 feature pt8">Real-time multi-user</p>
          </div>

          <div className="pricing-plan-container common-shadow flex column pa32 ma32">
            <div className="plan-price-container orange flex column hc vc pa16 mb16">
              <h2 className="price-important">
                Agency
                <br />
                <span className="price-unimportant">
                  Plans starting at $300 / month
                </span>
              </h2>
            </div>
            <p className="width100 feature pt8">Dedicated industry writer</p>
            <p className="width100 feature pt8">Blog posts</p>
            <p className="width100 feature pt8">Email newsletters</p>
            <p className="width100 feature pt8">Social media posts</p>
            <p className="width100 feature pt8">Keyword research</p>
            <p className="width100 feature pt8">Competitive analysis</p>{" "}
          </div>

          <div className="pricing-plan-container common-shadow flex column pa32 ma32">
            <div className="plan-price-container purple flex column hc vc pa16 mb16">
              <h2 className="price-important">
                Enterprise
                <br />
                <span className="price-unimportant">
                  Contact us for pricing
                </span>
              </h2>
            </div>
            <p className="width100 feature pt8">Custom reporting</p>
            <p className="width100 feature pt8">Custom feature-building</p>
            <p className="width100 feature pt8">Custom Branding</p>
            <p className="width100 feature pt8">
              In-depth competitive analysis
            </p>
            <p className="width100 feature pt8">
              Marketing campaign templates (custom or pre-built)
            </p>
            <p className="width100 feature pt8">Custom workflows</p>
            <p className="width100 feature pt8">Social scheduling</p>
            <p className="width100 feature pt8">Task manager</p>
          </div>
        </div>
        <h4 className="my32">Have questions? Give us a call: 250-415-3093</h4>
      </div>
    );
  }
}

export default PricingPage;
