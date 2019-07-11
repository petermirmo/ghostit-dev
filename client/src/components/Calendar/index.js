import React, { Component } from "react";
import moment from "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { getPostIcon, getPostColor } from "../../componentFunctions";

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
        <div className="flex column">
          <div className="calendar-day-titles-container">
            {dayHeadingsArray}
          </div>
          {calendarWeekArray}
        </div>
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
