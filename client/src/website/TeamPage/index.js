import React, { Component } from "react";

import { teamMembers } from "./teamMembers";

import "./style.css";

class TeamPage extends Component {
  isElementInViewport = el => {
    // IMPORTANT THIS FUNCTION HAS BEEN TAKEN FROM STACK OVERFLOW
    // https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
      el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight ||
          document.documentElement.clientHeight) /*or $(window).height() */ &&
      rect.right <=
        (window.innerWidth ||
          document.documentElement.clientWidth) /*or $(window).width() */
    );
  };
  test = id => {
    let element = document.getElementById(id);
    if (element) {
      if (!this.isElementInViewport(element)) {
        element.style.right = "100%";
        element.style.left = "auto";
      }
    }

    let element2 = document.getElementById(id);
    if (element2) {
      if (!this.isElementInViewport(element2)) {
        element.style.bottom = "100%";
        element.style.top = "auto";
        this.test();
      }
    }

    let element3 = document.getElementById(id);
    if (element3) {
      if (!this.isElementInViewport(element3)) {
        element.style.left = "100%";
        element.style.right = "auto";
        this.test();
      }
    }
  };
  render() {
    return (
      <div
        className="team-page section pa32 flex column"
        style={{ minHeight: "100vh" }}
      >
        <h1 className="team-page-tag-line silly-font py16">
          Meet the Ghostit Team!
        </h1>
        <div className="team-members-container flex vc hc wrap pb32 mb32">
          {teamMembers.map((obj, index) => {
            let id = index + "team-member";
            return (
              <div
                className="team-member-container mx16 mb32"
                key={index + "team"}
                onMouseEnter={() => this.test(id)}
                onMouseLeave={() => this.test(id)}
              >
                <div className="team-member-image-container round">
                  <img
                    src={"public/" + obj.image}
                    alt="'image'"
                    className="team-member-image"
                  />
                </div>
                <h4 className="team-member-name py8">{obj.name}</h4>
                <div
                  className="team-member-dropdown-container br8 pa32"
                  id={id}
                >
                  <h4 className="team-member-name py8">{obj.name}</h4>
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
