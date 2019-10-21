import React, { Component } from "react";
import moment from "moment-timezone";

import Consumer, { ExtraContext } from "../../context";

import Page from "../../components/containers/Page";
import Modal0 from "../../components/containers/Modal0";

import Dashboard from "../../components/Dashboard";

import TemplatesModal from "../../components/postingFiles/TemplatesModal";
import Campaign from "../../components/postingFiles/CampaignAndRecipe/Campaign";
import PostCreation from "../../components/postingFiles/PostCreation";

import GIText from "../../components/views/GIText";
import GIContainer from "../../components/containers/GIContainer";

import { getCalendars, triggerSocketPeers, initSocket } from "../util";

class DashboardPage extends Component {
  state = {
    activeCalendarIndex: 0,
    calendarDate: new moment(),
    defaultCalendarID: "",
    timezone: "America/Vancouver",

    clickedEvent: undefined,
    clickedEventIsRecipe: false,
    recipeEditing: false,

    campaignModal: false,
    contentModal: false,
    templatesModal: false
  };
  componentDidMount() {
    this._ismounted = true;
    const { calendars, activeCalendarIndex } = this.context;

    initSocket(
      stateObject => {
        if (this._ismounted) this.setState(stateObject);
      },
      calendars,
      activeCalendarIndex
    );
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObject => {
    if (this._ismounted) this.setState(stateObject);
  };
  render() {
    const {
      calendarDate,
      campaignModal,
      clickedEvent,
      clickedEventIsRecipe,
      contentModal,
      recipeEditing,
      templatesModal
    } = this.state;
    const { activeCalendarIndex, calendars } = this.context;

    const modalsOpen = campaignModal || contentModal || templatesModal;

    return (
      <Consumer>
        {context => (
          <Page className="column" title="Dashboard">
            {!modalsOpen && (
              <GIContainer className="x-fill column align-center py32 px32">
                <GIText className="mb32 mx8" type="h1" text="Dashboard" />
                <Dashboard handleParentChange={this.handleChange} />
              </GIContainer>
            )}

            {templatesModal && calendars[activeCalendarIndex] && (
              <TemplatesModal
                calendarID={calendars[activeCalendarIndex]._id}
                clickedCalendarDate={calendarDate}
                handleParentChange={this.handleChange}
              />
            )}
            {contentModal && calendars[activeCalendarIndex] && (
              <Modal0
                body={
                  <PostCreation
                    calendarAccounts={calendars[activeCalendarIndex].accounts}
                    calendarID={calendars[activeCalendarIndex]._id}
                    clickedCalendarDate={calendarDate}
                    handleParentChange={this.handleChange}
                    notify={context.notify}
                    savePostCallback={post => {
                      triggerSocketPeers("calendar_post_saved", post);
                      this.handleChange({ contentModal: false });
                      context.notify({
                        type: "success",
                        title: "Post saved successfully!"
                      });
                    }}
                  />
                }
                close={() => this.handleChange({ contentModal: false })}
              />
            )}
            {campaignModal && calendars[activeCalendarIndex] && (
              <Modal0
                body={
                  <Campaign
                    calendarAccounts={calendars[activeCalendarIndex].accounts}
                    calendarID={calendars[activeCalendarIndex]._id}
                    campaign={clickedEvent}
                    clickedCalendarDate={calendarDate}
                    handleParentChange={this.handleChange}
                    isRecipe={clickedEventIsRecipe}
                    recipeEditing={recipeEditing}
                    triggerSocketPeers={triggerSocketPeers}
                  />
                }
                className="large-modal"
                close={() => this.handleChange({ campaignModal: false })}
              />
            )}
          </Page>
        )}
      </Consumer>
    );
  }
}
DashboardPage.contextType = ExtraContext;

export default DashboardPage;
