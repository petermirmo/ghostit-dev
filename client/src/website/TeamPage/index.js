import React, { Component } from "react";
import MetaTags from "react-meta-tags";

import { teamMembers } from "./teamMembers";

import "./style.css";

class TeamPage extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  isElementInViewport = el => {
    // IMPORTANT THIS FUNCTION HAS BEEN TAKEN FROM STACK OVERFLOW
    // https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
    var rect = el.getBoundingClientRect();

    let top = false;
    let right = false;
    let bottom = false;
    let left = false;

    if (rect.top <= 0) top = rect.top;
    if (rect.left <= 0) left = rect.left;

    if (
      rect.right >= (window.innerWidth || document.documentElement.clientWidth)
    )
      right = rect.right - document.documentElement.clientWidth;
    if (
      rect.bottom >=
      (window.innerHeight || document.documentElement.clientHeight)
    )
      bottom = rect.bottom - document.documentElement.clientHeight;

    return [top, right, bottom, left];
  };
  correctOverflow = element => {
    if (element) {
      let overflowArray = this.isElementInViewport(element);
      if (overflowArray) {
        if (overflowArray[0]) {
          // overflows top
          element.style.top = "calc(50% + " + (overflowArray[0] + 48) + "px)";
        } else if (overflowArray[2]) {
          // overflows bottom
          element.style.top = "calc(50% - " + (overflowArray[2] + 48) + "px)";
        }

        if (overflowArray[1]) {
          // overflows right
          element.style.right = "calc(100% + 8px)";
          element.style.left = "auto";
        } else if (overflowArray[3]) {
          // overflows left
          element.style.left = "100% + 8px";
          element.style.right = "auto";
        }
      }
    }
  };
  render() {
    return (
      <div className="website-page flex column vc">
        <MetaTags>
          <title>Ghostit | Team</title>
          <meta name="description" content="Meet the Ghostit Team!" />
          <meta property="og:title" content="Ghostit | Team" />
          <meta property="og:description" content="Meet the Ghostit Team!" />
          <meta
            property="og:image"
            content="https://res.cloudinary.com/ghostit-co/image/upload/v1544851159/5993441872de2b0001f8b90c_Ghostit_Logo_-_Final_webclip.png"
          />
        </MetaTags>
        <h1 className="pb16 tac">Meet the Ghostit Team!</h1>
        <div className="team-members-container flex vc hc wrap pb32 mb32">
          {teamMembers.map((obj, index) => {
            let id = index + "team-member";
            return (
              <div
                className="team-member-container pa16 br8 common-transition"
                key={index + "team"}
                onMouseEnter={event => {
                  this.correctOverflow(document.getElementById(id));
                  event.target.style.backgroundColor = obj.color;
                }}
                onMouseOut={event => {
                  event.target.style.backgroundColor = "transparent";
                }}
              >
                <div className="team-member-image-container round">
                  <img
                    src={obj.image}
                    alt="'image'"
                    className="team-member-image"
                  />
                </div>
                <h4 className="team-member-name silly-font py8 tac">
                  {obj.name}
                </h4>
                <div
                  className="team-member-dropdown-container br8 pa32"
                  style={{ backgroundColor: obj.color }}
                  id={id}
                >
                  <h4 className="team-member-name silly-font py8">
                    {obj.name}
                  </h4>
                  <h4 className="team-member-title">{obj.title}</h4>
                  <p className="team-member-description">{obj.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default TeamPage;
