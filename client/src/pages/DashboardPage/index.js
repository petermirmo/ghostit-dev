import React, { Component } from "react";
import moment from "moment-timezone";
import Page from "../../components/containers/Page";

import Dashboard from "../../components/dashboard";

import { getCalendars } from "../util";

class DashboardPage extends Component {
  state = {
    activeCalendarIndex: 0,
    calendarDate: new moment(),
    calendars: [],
    defaultCalendarID: "",
    timezone: "America/Vancouver"
  };
  componentDidMount() {
    this._ismounted = true;

    getCalendars(stateObject => {
      if (this._ismounted) this.setState(stateObject);
    });
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  render() {
    const { activeCalendarIndex, calendars, calendarDate } = this.state;
    return (
      <Page className="column align-center py64 px64">
        <Dashboard
          calendarToSaveTo={calendars[activeCalendarIndex]}
          clickedDate={calendarDate}
        />
      </Page>
    );
  }
}

export default DashboardPage;
