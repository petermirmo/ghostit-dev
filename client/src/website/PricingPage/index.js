import React, { Component } from "react";

import "./style.css";

class PricingPage extends Component {
  render() {
    return (
      <div className="website-page flex column vc">
        <h1 className="silly-font pb16">Ghostit Pricing</h1>
        <h4>Have questions? Give us a call: (Rahul's phone number)</h4>

        <div className="pricing-plans-container flex hc">
          <div className="pricing-plan-container common-shadow flex column pa32 ma32">
            <div className="plan-price-container orange flex column hc vc pa16 mb16">
              <h2 className="price-important">
                STARTER<br /> <span className="price-unimportant">Free</span>
              </h2>
            </div>
            <p>Full software access for 30 days!</p>
          </div>
          <div className="pricing-plan-container common-shadow flex column pa32 ma32">
            <div className="plan-price-container blue flex column hc vc pa16 mb16">
              <h2 className="price-important">
                PRO<br />
                <span className="price-unimportant">$40</span>
                <span className="price-unimportant">/month</span>
              </h2>
            </div>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
          </div>
          <div className="pricing-plan-container common-shadow flex column pa32 ma32">
            <div className="plan-price-container purple flex column hc vc pa16 mb16">
              <h2 className="price-important">
                ENTERPRISE<br />
                <span className="price-unimportant">Contact Us</span>
              </h2>
            </div>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
            <p>something</p>
          </div>
        </div>
      </div>
    );
  }
}

export default PricingPage;
