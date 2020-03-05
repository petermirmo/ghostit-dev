import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";

import { teamMembers } from "../TeamPage/teamMembers";

import { isMobileOrTablet } from "../../util";
import { capitolizeWordsInString } from "../../componentFunctions";

class TeamPage extends Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    const { pathname } = location;

    const teamMemberID = Number(this.getIDFromURL(pathname));

    if (Number.isInteger(teamMemberID))
      this.state = { teamMember: teamMembers[teamMemberID - 1] };
    else this.state = { teamMember: undefined };
  }
  getIDFromURL = pathname => {
    let teamMemberID = "";
    for (let i = pathname.length - 1; i >= 0; i--) {
      if (pathname[i] === "/") return teamMemberID;
      else teamMemberID = pathname[i] + teamMemberID;
    }

    return teamMemberID;
  };
  render() {
    const { teamMember } = this.state;
    return (
      <Page
        className={
          "website-page align-center " + (isMobileOrTablet() ? "mt32" : "mt64")
        }
        description="Bring your marketing concept to life with Ghostit’s team of content creators. From content development to SEO services, we can do it all."
        keywords="content creators"
        title="Content Creation Team"
      >
        {teamMember && (
          <GIContainer
            className={
              "column " +
              (isMobileOrTablet()
                ? "container mobile-full px16"
                : "container extra-large px64")
            }
          >
            <GIContainer>
              <div className="container-box xy-200px round blue-shadow-fade mr32 mb32">
                <img alt="" className="x-200px" src={teamMember.image} />
              </div>
              <GIContainer className="column justify-center">
                <GIText
                  className="muli ellipsis mb4"
                  text={teamMember.name}
                  type="h1"
                />
                <GIText
                  className="bold ellipsis mb8"
                  text={teamMember.title}
                  type="p"
                />
              </GIContainer>
            </GIContainer>
            <GIText
              className=""
              style={{ lineHeight: 1.6 }}
              text={teamMember.description}
              type="p"
            />
          </GIContainer>
        )}
        {!teamMember && <GIContainer>Team Member not found :(</GIContainer>}
      </Page>
    );
  }
}

export default withRouter(TeamPage);
