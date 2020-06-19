import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Consumer from "../../context";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import GIText from "../../components/views/GIText";

import LoaderSimpleCircle from "../../components/notifications/LoaderSimpleCircle";

import Blog from "../BlogPage/Blog";

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
      this.state = {
        teamMember: teamMembers.find(
          (teamMember, index) => teamMember._id === teamMemberID
        )
      };
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
      <Consumer>
        {context => (
          <Page
            className={
              "website-page align-center " +
              (isMobileOrTablet() ? "mt32" : "mt64")
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
                <GIContainer className="x-fill wrap">
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
                {context.ghostitBlogs.length === 0 && (
                  <GIContainer className="fill-parent full-center mt32">
                    <LoaderSimpleCircle />
                  </GIContainer>
                )}
                {context.ghostitBlogs.length !== 0 &&
                  context.ghostitBlogs.find(
                    (ghostitBlog, index) =>
                      ghostitBlog.authorID === teamMember._id
                  ) && (
                    <GIText className="py32" type="h4">
                      Articles written by{" "}
                      <GIText
                        className="four-blue"
                        text={teamMember.name}
                        type="span"
                      />
                    </GIText>
                  )}
                {context.ghostitBlogs.length !== 0 && (
                  <GIContainer
                    className={
                      "x-fill mb32 " +
                      (isMobileOrTablet()
                        ? "grid-200px grid-gap-16"
                        : "grid-300px grid-gap-32")
                    }
                  >
                    {context.ghostitBlogs.map((ghostitBlog, index) => {
                      if (ghostitBlog.authorID === teamMember._id)
                        return (
                          <Blog
                            activeBlogCategory={0}
                            ghostitBlog={ghostitBlog}
                            key={index}
                            user={context.user}
                          />
                        );
                    })}
                  </GIContainer>
                )}
              </GIContainer>
            )}
            {!teamMember && <GIContainer>Team Member not found :(</GIContainer>}
          </Page>
        )}
      </Consumer>
    );
  }
}

export default withRouter(TeamPage);
