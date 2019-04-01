import React, { Component } from "react";

import GIContainer from "../containers/GIContainer";

import GIText from "../views/GIText";
import GIButton from "../views/GIButton";

class Dashboard extends Component {
  render() {
    return (
      <GIContainer className="x-fill column">
        <GIText className="mb32 mx8" type="h1" text="Dashboard" />
        <GIContainer className="x-wrap x-fill">
          <GIContainer className="container-box column twentyvw justify-between py16 px32 mb32 mx8 br8 common-border">
            <GIText
              text="Create a post"
              type="h3"
              className="seven-blue mb16"
            />
            <GIContainer className="full-center x-fill y-50">
              <img src="src/svgs/dashboard-post.svg" className="fill-parent" />
            </GIContainer>
            <GIContainer className="x-fill full-center column">
              <GIText
                className="tac mb8"
                text="Create and schedule a new post to your social media."
                type="p"
              />
              <GIButton
                text="Create post"
                className="regular-button light small x-85"
              />
            </GIContainer>
          </GIContainer>
          <GIContainer className="container-box column twentyvw justify-between py16 px32 mb32 mx8 br8 common-border">
            <GIText
              text="Create a campaign"
              type="h3"
              className="seven-blue mb16"
            />
            <GIContainer className="full-center x-fill y-50">
              <img
                src="src/svgs/dashboard-campaign.svg"
                className="fill-parent"
              />
            </GIContainer>
            <GIContainer className="x-fill full-center column">
              <GIText
                className="tac mb8"
                text="Create a new campaign and schedule multiple posts. "
                type="p"
              />
              <GIButton
                text="Create campaign"
                className="regular-button light small x-85"
              />
            </GIContainer>
          </GIContainer>
          <GIContainer className="container-box column twentyvw justify-between py16 px32 mb32 mx8 br8 common-border">
            <GIText
              text="Browse templates"
              type="h3"
              className="seven-blue mb16"
            />
            <GIContainer className="full-center x-fill y-50">
              <img
                src="src/svgs/dashboard-templates.svg"
                className="fill-parent"
              />
            </GIContainer>
            <GIContainer className="x-fill full-center column">
              <GIText
                className="tac mb8"
                text="Browse existing templates to help your marketing strategy."
                type="p"
              />
              <GIButton
                text="Browse templates"
                className="regular-button light small x-85"
              />
            </GIContainer>
          </GIContainer>
        </GIContainer>
      </GIContainer>
    );
  }
}

export default Dashboard;
