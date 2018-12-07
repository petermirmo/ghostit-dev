import React, { Component } from "react";
import moment from "moment-timezone";

class Section5 extends Component {
  render() {
    return (
      <div className="flex column vc wrap border-box width100 pb32 mb64">
        <h1 className="silly-font tac">Here's what our customers are saying</h1>
        <div className="client-testimony-container mx64">
          <div className="team-member-image-container round">
            <img
              src="public/client-testimony.jpg"
              alt="'image'"
              className="team-member-image"
            />
          </div>

          <div className="client-text-testimony-container pa32">
            <p className="client-testimony px32">
              "Repeatedly running digital campaigns for multipls clients can get
              both cumbersome and at times confusing. Ghostit's platform lets me
              schedule all of my client's marketing initiatives unlike any other
              platform and keep them all organized."
            </p>
            <p className="client-testimony-client-name px32 py8">
              - Sean Wiggins, North Digital Founder
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Section5;
