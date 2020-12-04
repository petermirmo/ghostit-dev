import React, { Component } from "react";

import GIContainer from "../containers/GIContainer";

import GIText from "../views/GIText";
import GIButton from "../views/GIButton";

class Dashboard extends Component {
  render() {
    const { handleParentChange } = this.props; // Functions

    return (
      <GIContainer className={`wrap x-fill justify-center`}>
        <GIContainer className="container-box small bg-white column justify-between common-border pt32 pb16 px16 mb32 mx8 br8">
          <GIContainer className="full-center x-fill flex-fill">
            <GIContainer className="full-center x-50">
              <img
                alt=""
                src={require("../../svgs/dashboard-post.svg")}
                className="fill-parent"
              />
            </GIContainer>
          </GIContainer>
          <GIText className="five-blue tac mt32 mb8" type="h4">
            Create a
            <GIText className="bold" text="&nbsp;Post" type="span" />
          </GIText>
          <GIContainer className="x-fill full-center column">
            <GIText
              className="tac mb32"
              text="Create and schedule a new post to your social media."
              type="p"
            />
            <GIButton
              className="x-fill shadow-blue-3 bg-blue-fade-2 white br4 py8"
              onClick={() => handleParentChange({ contentModal: true })}
              text="Create"
            />
          </GIContainer>
        </GIContainer>
        <GIContainer className="container-box small bg-white column justify-between common-border pt32 pb16 px16 mb32 mx8 br8">
          <GIContainer className="full-center x-fill flex-fill">
            <GIContainer className="full-center x-50">
              <img
                alt=""
                className="fill-parent"
                src={require("../../svgs/dashboard-campaign.svg")}
              />
            </GIContainer>
          </GIContainer>
          <GIText className="five-blue tac mt32 mb8" type="h4">
            Create a
            <GIText className="bold" text="&nbsp;Campaign" type="span" />
          </GIText>
          <GIContainer className="x-fill full-center column">
            <GIText
              className="tac mb32"
              text="Create a new campaign and schedule multiple posts. "
              type="p"
            />
            <GIButton
              className="x-fill shadow-blue-3 bg-blue-fade-2 white br4 py8"
              onClick={() => handleParentChange({ campaignModal: true })}
              text="Create"
            />
          </GIContainer>
        </GIContainer>
        <GIContainer className="container-box small bg-white column justify-between common-border pt32 pb16 px16 mb32 mx8 br8">
          <GIContainer className="full-center x-fill flex-fill">
            <GIContainer className="full-center x-50">
              <img
                alt=""
                className="fill-parent"
                src={require("../../svgs/dashboard-templates.svg")}
              />
            </GIContainer>
          </GIContainer>
          <GIText className="five-blue tac mt32 mb8" type="h4">
            Browse
            <GIText className="bold" text="&nbsp;Templates" type="span" />
          </GIText>
          <GIContainer className="x-fill full-center column">
            <GIText
              className="tac mb32"
              text="Browse existing templates to help your marketing strategy."
              type="p"
            />
            <GIButton
              className="x-fill shadow-blue-3 bg-blue-fade-2 white br4 py8"
              onClick={() => handleParentChange({ templatesModal: true })}
              text="Browse"
            />
          </GIContainer>
        </GIContainer>
      </GIContainer>
    );
  }
}
export default Dashboard;
