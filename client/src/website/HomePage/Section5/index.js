import React, { Component } from "react";

class Section5 extends Component {
  render() {
    return (
      <div className="common-container py64">
        <h1 className="tac mx16">Here's what our customers are saying</h1>
        <div className="wrapping-container-full-center">
          <div className="container-box tinier round mx32">
            <img
              alt=""
              className="x-200px"
              src="https://res.cloudinary.com/ghostit-co/image/upload/v1544851312/IMG_9627_2.jpg"
            />
          </div>

          <div className="container-box column tiny py32 mx32 fill-flex">
            <p>
              "Repeatedly running digital campaigns for multiple clients can get
              both cumbersome and at times confusing. Ghostit's platform lets me
              schedule all of my client's marketing initiatives unlike any other
              platform and keep them all organized."
            </p>
            <p className="py8">- Sean Wiggins, North Digital Founder</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Section5;
