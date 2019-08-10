import React, { Component } from "react";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import GIContainer from "../containers/GIContainer";

import FileUpload from "../views/FileUpload/";

import {
  calendarHeader,
  compareCampaigns,
  compareCampaignPosts,
  compareCampaignPostsReverse,
  createCalendarWeeks,
  createDayHeaders
} from "./util";

import "./style.css";

class Calendar extends Component {
  render() {
    const { calendarEvents, calendarDate } = this.props;

    const calendarWeekArray = createCalendarWeeks(calendarDate, this.props);
    const dayHeadingsArray = createDayHeaders(moment.weekdays());

    return (
      <div className="calendar-container">
        <GIContainer className="column">
          <GIContainer className="calendar-day-heading-container py16">
            {dayHeadingsArray}
          </GIContainer>
          <GIContainer className="calendar-weeks-container column">
            {calendarWeekArray}
          </GIContainer>
        </GIContainer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Calendar);
