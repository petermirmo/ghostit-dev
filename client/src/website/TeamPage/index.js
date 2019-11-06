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
    const firstTeamRow = [];
    const secondTeamRow = [];
    const thirdTeamRow = [];
    const fourthTeamRow = [];

    for (let index in teamMembers) {
      const teamMember = teamMembers[index];

      if (index < 3) {
        firstTeamRow.push(teamMemberDiv(index, teamMember));
      } else if (index < 5) {
        secondTeamRow.push(teamMemberDiv(index, teamMember));
      } else if (index < 7) {
        thirdTeamRow.push(teamMemberDiv(index, teamMember));
      } else {
        fourthTeamRow.push(teamMemberDiv(index, teamMember));
      }
    }
    return (
      <Page
        className="website-page align-center mt32"
        description="Bring your marketing concept to life with Ghostit’s team of content creators. From content development to SEO services, we can do it all."
        keywords="content creators"
        title="Content Creation Team"
      >
        <GIText className="tac full-center pb8 mx32" type="h2">
          Meet the
          <GIText
            className="four-blue tac"
            text="&nbsp;Ghostit Team!"
            type="span"
          />
        </GIText>

        <GIText
          className="tac mb32 mx32"
          text="Have fun, make money!"
          type="h6"
        />

        <GIContainer
          className={"x-fill " + (isMobileOrTablet() ? "column px16" : "px64")}
        >
          {firstTeamRow}
        </GIContainer>
        <GIContainer
          className={
            "x-fill relative " + (isMobileOrTablet() ? "column px16" : "pr64")
          }
        >
          {!isMobileOrTablet() && (
            <GIContainer className="relative">
              <img
                alt=""
                className="container-box y-30vw"
                src="https://res.cloudinary.com/ghostit-co/image/upload/v1566407446/team-page-1.png"
              />
              <img
                alt="blob"
                id="circle-love"
                src={require("../../svgs/circle-love.svg")}
              />
            </GIContainer>
          )}

          {secondTeamRow}
        </GIContainer>

        <GIContainer
          className={
            "x-fill justify-end " +
            (isMobileOrTablet() ? "column px16" : "pl64")
          }
        >
          {thirdTeamRow}
          {!isMobileOrTablet() && (
            <GIContainer className="relative justify-end">
              <img
                alt=""
                className="container-box y-30vw"
                src="https://res.cloudinary.com/ghostit-co/image/upload/v1566407452/team-page-2.png"
              />
              <img
                alt="blob"
                id="circle-likes-2"
                src={require("../../svgs/circle-likes-2.svg")}
              />
            </GIContainer>
          )}
        </GIContainer>
        <GIContainer
          className={
            "x-fill relative " + (isMobileOrTablet() ? "column px16" : "px64")
          }
        >
          {fourthTeamRow}
        </GIContainer>
      </Page>
    );
  }
}

export default TeamPage;
