import React, { Component } from "react";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";

import { teamMembers } from "./teamMembers";

import { teamMemberDiv } from "./util";

import { isMobileOrTablet } from "../../util";

import "./style.css";

class TeamPage extends Component {
  render() {
    return (
      <Page
        className="website-page align-center mt32"
        description="Bring your marketing concept to life with Ghostit’s team of content creators. From content development to SEO services, we can do it all."
        keywords="content creators"
        title="Content Creation Team"
      >
        <GIText
          className={
            "tac full-center mx32 " + (isMobileOrTablet() ? "mb32" : "mb64")
          }
          type="h2"
        >
          Meet the Ghostit Team!
        </GIText>

        <GIContainer
          className={
            "wrap " +
            (isMobileOrTablet()
              ? "container mobile-full column px16"
              : "container full px64")
          }
        >
          {teamMembers.map((teamMember, index) =>
            teamMemberDiv(index, teamMember)
          )}
        </GIContainer>
      </Page>
    );
  }
}

export default TeamPage;
