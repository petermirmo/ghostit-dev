import React, { Component } from "react";
import moment from "moment-timezone";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faAngleLeft from "@fortawesome/fontawesome-free-solid/faAngleLeft";
import faAngleRight from "@fortawesome/fontawesome-free-solid/faAngleRight";
import faFacebookF from "@fortawesome/fontawesome-free-brands/faFacebookF";
import faLinkedinIn from "@fortawesome/fontawesome-free-brands/faLinkedinIn";
import faTwitterNormal from "@fortawesome/fontawesome-free-brands/faTwitter";

import faFacebook from "@fortawesome/fontawesome-free-brands/faFacebookSquare";
import faLinkedin from "@fortawesome/fontawesome-free-brands/faLinkedin";
import faTwitter from "@fortawesome/fontawesome-free-brands/faTwitterSquare";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {} from "../../redux/actions/";

import {
  getPostIcon,
  getPostColor,
  trySavePost,
  postChecks
} from "../../componentFunctions";

import ImagesDiv from "../ImagesDiv/";
import Filter from "../Filter";
import Tutorial from "../Tutorial/";
import CalendarPicker from "../CalendarPicker/";
import SocketUserList from "../SocketUserList/";

import "./style.css";

class Calendar extends Component {
  state = {
    timezone: this.props.timezone,
    queueActive: false
  };

  render() {
    let calendarDate = new moment();

    // Used to see which day the month starts on, does it start on a Monday or Sunday or Tuesday...
    let firstDayOfMonth = moment(calendarDate.date(1)).weekday();

    let weekStartMonth = firstDayOfMonth === 0 ? -1 : 0;

    let calendarWeekRows = [];
    // Week for loop
    // To determine if 5 or 6 weeks are needed in the calendar
    for (let weekIndex = weekStartMonth; weekIndex < 5; weekIndex++) {
      let calendarDayOutlines = [];

      for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
        let calendarDay = new moment(calendarDate)
          .date(1)
          .subtract(firstDayOfMonth, "days")
          .add(weekIndex * 7 + dayIndex, "days");

        calendarDayOutlines.push(
          <div
            className="calendar-day-outline"
            key={weekIndex + "day" + dayIndex}
          />
        );
      }

      calendarWeekRows.push(
        <div className="calendar-week-row" key={"week" + weekIndex}>
          {calendarDayOutlines}
          <div className="events-container">
            <div className="event-row">
              <div className="event">te</div>
            </div>
          </div>
        </div>
      );
    }

    return <div className="calendar">{calendarWeekRows}</div>;
  }
}
function mapStateToProps(state) {
  return {
    tutorial: state.tutorial
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Calendar);
