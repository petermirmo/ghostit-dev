import React, { Component } from "react";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";

import { teamMembers } from "./teamMembers";

import { correctOverflow } from "./util";

import { mobileAndTabletcheck } from "../../componentFunctions";

import "./style.css";

class TeamPage extends Component {
  render() {
    return (
      <Page
        className="website-page justify-center"
        title="Team"
        description="Meet the Ghostit Team!"
        keywords="ghostit, team"
      >
        <GIText className="pb16 tac" text="Meet the Ghostit Team!" type="h1" />
        <GIContainer className="x-wrap justify-center pb32 mb32">
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
                <div className="profile-image-container medium round no-pointer-events">
                  <img
                    alt=""
                    className="profile-image medium"
                    src={obj.image}
                  />
                </div>
                <GIText
                  className="team-member-name py8 tac"
                  style={{ color: obj.color }}
                  text={obj.name}
                  type="h6"
                />
                {!mobileAndTabletcheck() && (
                  <div
                    className="team-member-dropdown-container br8 pa32"
                    style={{ backgroundColor: obj.color }}
                    id={id}
                  >
                    <GIText
                      className="team-member-name py8"
                      text={obj.name}
                      type="h6"
                    />

                    <GIText
                      className="team-member-description"
                      text={obj.description}
                      type="p"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </GIContainer>
      </Page>
    );
  }
}

export default TeamPage;
