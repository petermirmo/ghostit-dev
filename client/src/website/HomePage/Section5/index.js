import React, { Component } from "react";
import moment from "moment-timezone";

class Section5 extends Component {
  render() {
    return (
      <div className="section flex column vc test">
        <h1 className="silly-font test2 pb32 mb32">
          Here's what our customers are saying
        </h1>
        <div className="flex">
          <div className="team-member-image-container round">
            <img
              src="public/peter.jpg"
              alt="'image'"
              className="team-member-image"
            />
          </div>

          <div className="client-testimony-container pa32">
            <p className="client-testimony pa32">
              "Repeatedly running digital campaigns for multipls clients can get
              both cumbersome and at times confusing. Ghostit's platform lets me
              schedule all of my client's marketing initiatives unlike any other
              platform and keep them all organized."
            </p>
            <p className="client-testimony-client pa32">
              - Sean Wiggins, North Digital Founder
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Section5;
