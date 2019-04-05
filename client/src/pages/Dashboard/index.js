import React, { Component } from "react";
import moment from "moment-timezone";
import Page from "../../components/containers/Page";

import Dashboard from "../../components/dashboard";

import TemplatesModal from "../../components/postingFiles/CampaignAndRecipe/TemplatesModal";
import Campaign from "../../components/postingFiles/CampaignAndRecipe/Campaign";
import ContentModal from "../../components/postingFiles/ContentModal";

import {
  getCalendars,
  getCampaigns,
  triggerSocketPeers,
  initSocket
} from "../util";
import Consumer, { NotificationContext } from "../../context";

class DashboardPage extends Component {
  state = {
    activeCalendarIndex: 0,
    calendarDate: new moment(),
    calendars: [],
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
    const { calendars, activeCalendarIndex } = this.state;

    getCalendars(stateObject => {
      if (this._ismounted) this.setState(stateObject);
      initSocket(
        stateObject => {
          if (this._ismounted) this.setState(stateObject);
        },
        calendars,
        activeCalendarIndex
      );
    });
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObject => {
    if (this._ismounted) this.setState(stateObject);
  };
  render() {
    const {
      activeCalendarIndex,
      calendars,
      calendarDate,
      campaignModal,
      clickedEvent,
      clickedEventIsRecipe,
      contentModal,
      recipeEditing,
      templatesModal
    } = this.state;

    return (
      <Consumer>
        {context => (
          <Page className="column align-center py64 px64">
            <Dashboard
              handleChange={stateObject => {
                if (this._ismounted) this.setState(stateObject);
              }}
            />

            {templatesModal && calendars[activeCalendarIndex] && (
              <TemplatesModal
                calendarID={calendars[activeCalendarIndex]._id}
                clickedCalendarDate={calendarDate}
                handleParentChange={this.handleChange}
              />
            )}
            {contentModal && calendars[activeCalendarIndex] && (
              <ContentModal
                calendarID={calendars[activeCalendarIndex]._id}
                clickedCalendarDate={calendarDate}
                handleParentChange={this.handleChange}
                savePostCallback={post => {
                  triggerSocketPeers("calendar_post_saved", post);
                  this.handleChange({ contentModal: false });
                  context.notify({
                    type: "success",
                    title: "Post saved successfully!"
                  });
                }}
              />
            )}
            {campaignModal && calendars[activeCalendarIndex] && (
              <div
                className="modal"
                onClick={() => this.handleChange({ campaignModal: false })}
              >
                <div
                  className="large-modal common-transition"
                  onClick={e => e.stopPropagation()}
                >
                  <Campaign
                    calendarID={calendars[activeCalendarIndex]._id}
                    campaign={clickedEvent}
                    clickedCalendarDate={calendarDate}
                    handleParentChange={this.handleChange}
                    isRecipe={clickedEventIsRecipe}
                    recipeEditing={recipeEditing}
                    triggerSocketPeers={triggerSocketPeers}
                  />
                </div>
              </div>
            )}
          </Page>
        )}
      </Consumer>
    );
  }
}

export default DashboardPage;
