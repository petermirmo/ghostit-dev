import React, { Component } from "react";

import GIContainer from "../containers/GIContainer";

import GIText from "../views/GIText";
import GIButton from "../views/GIButton";

import TemplatesModal from "../postingFiles/CampaignAndRecipe/TemplatesModal";

class Dashboard extends Component {
  state = {
    campaignModal: false,
    contentModal: false,
    templatesModal: false
  };
  render() {
    const { contentModal, campaignModal, templatesModal } = this.state;
    const { calendarToSaveTo, clickedDate } = this.props;
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
                className="regular-button light small x-85"
                onClick={() => this.setState({ contentModal: true })}
                text="Create post"
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
                className="regular-button light small x-85"
                onClick={() => this.setState({ campaignModal: true })}
                text="Create campaign"
              />
            </GIContainer>
          </GIContainer>
          <GIContainer className="container-box column twentyvw justify-between py16 px32 mb32 mx8 br8 common-border">
            <GIText
              className="seven-blue mb16"
              text="Browse templates"
              type="h3"
            />
            <GIContainer className="full-center x-fill y-50">
              <img
                className="fill-parent"
                src="src/svgs/dashboard-templates.svg"
              />
            </GIContainer>
            <GIContainer className="x-fill full-center column">
              <GIText
                className="tac mb8"
                text="Browse existing templates to help your marketing strategy."
                type="p"
              />
              <GIButton
                className="regular-button light small x-85"
                onClick={() => this.setState({ templatesModal: true })}
                text="Browse templates"
              />
            </GIContainer>
          </GIContainer>
        </GIContainer>

        {templatesModal && calendarToSaveTo && (
          <TemplatesModal
            close={() => this.setState({ templatesModal: false })}
            handleChange={() => {}}
            clickedCalendarDate={clickedDate}
            calendarID={calendarToSaveTo._id}
          />
        )}
      </GIContainer>
    );
  }
}
/*{contentModal && calendarToSaveTo && (
  <ContentModal
    calendarID={calendarToSaveTo._id}
    clickedCalendarDate={clickedDate}
    notify={this.notify}
    savePostCallback={post => {
      this.getPosts();
      this.triggerSocketPeers("calendar_post_saved", post);
      this.props.openContentModal(false);
    }}
  />
)}
{campaignModal && calendarToSaveTo && (
  <div
    className="modal"
    onClick={() => this.props.openCampaignModal(false)}
  >
    <div
      className="large-modal common-transition"
      onClick={e => e.stopPropagation()}
    >
      <Campaign
        calendarID={calendarToSaveTo._id}
        clickedCalendarDate={clickedDate}
        handleChange={this.handleChange}
        notify={this.notify}
        triggerSocketPeers={this.triggerSocketPeers}
        updateCampaigns={() => {}}
      />
    </div>
  </div>
)}*/

export default Dashboard;
