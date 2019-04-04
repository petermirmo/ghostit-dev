import React, { Component } from "react";
import moment from "moment-timezone";
import Page from "../../components/containers/Page";

import Dashboard from "../../components/dashboard";

import TemplatesModal from "../../components/postingFiles/CampaignAndRecipe/TemplatesModal";
import ContentModal from "../../components/postingFiles/ContentModal";

import { getCalendars, triggerSocketPeers, initSocket } from "../util";

class DashboardPage extends Component {
  state = {
    activeCalendarIndex: 0,
    calendarDate: new moment(),
    calendars: [],
    defaultCalendarID: "",
    timezone: "America/Vancouver",

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
  render() {
    const {
      activeCalendarIndex,
      calendars,
      calendarDate,
      campaignModal,
      contentModal,
      templatesModal
    } = this.state;

    return (
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
            close={() => this.setState({ templatesModal: false })}
            handleChange={something => {
              console.log(something);
            }}
          />
        )}
        {contentModal && calendars[activeCalendarIndex] && (
          <ContentModal
            calendarID={calendars[activeCalendarIndex]._id}
            clickedCalendarDate={calendarDate}
            close={() => this.setState({ contentModal: false })}
            savePostCallback={post => {
              triggerSocketPeers("calendar_post_saved", post);
              this.setState({ contentModal: false });
            }}
          />
        )}
      </Page>
    );
  }
}

/*
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

        triggerSocketPeers={this.triggerSocketPeers}
        updateCampaigns={() => {}}
      />
    </div>
  </div>
)}*/

export default DashboardPage;
