import React, { Component } from "react";

import GIContainer from "../containers/GIContainer";

import GIText from "../views/GIText";
import GIButton from "../views/GIButton";

class Dashboard extends Component {
  render() {
    const { className } = this.props; // Variables
    const { handleParentChange } = this.props; // Functions
    return (
      <GIContainer className="x-fill y-fill column ov-auto">
        <GIContainer className={`x-wrap x-fill ${className}`}>
          <GIContainer className="container-box bg-white column twentyvw justify-between common-border py16 px32 mb32 mx8 br8">
            <GIContainer className="full-center x-fill y-50">
              <img
                alt=""
                src={require("../../svgs/dashboard-post.svg")}
                className="fill-parent"
              />
            </GIContainer>
            <GIText
              className="five-blue mb16 tac"
              text="Create a post"
              type="h4"
            />
            <GIContainer className="x-fill full-center column">
              <GIText
                className="tac mb8"
                text="Create and schedule a new post to your social media."
                type="p"
              />
              <GIButton
                className="regular-button light small x-85"
                onClick={() => handleParentChange({ contentModal: true })}
                text="Create post"
              />
            </GIContainer>
          </GIContainer>
          <GIContainer className="container-box bg-white column twentyvw justify-between common-border py16 px32 mb32 mx8 br8">
            <GIContainer className="full-center x-fill y-50">
              <img
                alt=""
                className="fill-parent"
                src={require("../../svgs/dashboard-campaign.svg")}
              />
            </GIContainer>
            <GIText
              className="five-blue mb16 tac"
              text="Create a campaign"
              type="h4"
            />
            <GIContainer className="x-fill full-center column">
              <GIText
                className="tac mb8"
                text="Create a new campaign and schedule multiple posts. "
                type="p"
              />
              <GIButton
                className="regular-button light small x-85"
                onClick={() => handleParentChange({ campaignModal: true })}
                text="Create campaign"
              />
            </GIContainer>
          </GIContainer>
          <GIContainer className="container-box bg-white column twentyvw justify-between common-border py16 px32 mb32 mx8 br8">
            <GIContainer className="full-center x-fill y-50">
              <img
                alt=""
                className="fill-parent"
                src={require("../../svgs/dashboard-templates.svg")}
              />
            </GIContainer>
            <GIText
              className="five-blue mb16 tac"
              text="Browse templates"
              type="h4"
            />
            <GIContainer className="x-fill full-center column">
              <GIText
                className="tac mb8"
                text="Browse existing templates to help your marketing strategy."
                type="p"
              />
              <GIButton
                className="regular-button light small x-85"
                onClick={() => handleParentChange({ templatesModal: true })}
                text="Browse templates"
              />
            </GIContainer>
          </GIContainer>
        </GIContainer>
      </GIContainer>
    );
  }
}
export default Dashboard;
