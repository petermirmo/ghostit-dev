import React, { Component } from "react";
import Page from "../../components/containers/Page";

import { teamMembers } from "./teamMembers";

import { isElementInViewport, correctOverflow } from "./util";
import "./style.css";

class TeamPage extends Component {
  render() {
    return (
      <Page
        className="flex column vc website-page"
        title="Team"
        description="Meet the Ghostit Team!"
        keywords="ghostit, team"
      >
        <h1 className="pb16 tac">Meet the Ghostit Team!</h1>
        <div className="wrapping-container pb32 mb32">
          {teamMembers.map((obj, index) => {
            let id = index + "team-member";
            return (
              <div
                className="simple-column-box pa16 br8 common-transition"
                key={index + "team"}
                onMouseEnter={event => {
                  correctOverflow(document.getElementById(id));
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
                <h4
                  className="team-member-name silly-font py8 tac"
                  style={{ color: obj.color }}
                >
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
      </Page>
    );
  }
}

export default TeamPage;
