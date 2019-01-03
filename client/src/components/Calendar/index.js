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
    let events = this.props.calendarEvents;
    let calendarDate = new moment().date(1);

    // Used to see which day the month starts on, does it start on a Monday or Sunday or Tuesday...
    let firstDayOfMonth = moment(calendarDate).weekday();

    let weekStartMonth = firstDayOfMonth === 0 ? -1 : 0;

    let calendarWeekRows = [];

    let testArray = [];
    for (let weekIndex = weekStartMonth; weekIndex < 5; weekIndex++) {
      testArray.push([[0, 0, 0, 0, 0, 0, 0]]);
    }
    for (let index in events) {
      let currentEvent = events[index];

      for (let weekIndex = weekStartMonth; weekIndex < 5; weekIndex++) {
        let weekStart = new moment(calendarDate)
          .subtract(firstDayOfMonth, "days")
          .add(weekIndex * 7, "days")
          .startOf("day");

        let weekEnd = new moment(weekStart).add(6, "days").endOf("day");

        if (
          !(
            new moment(currentEvent.endDate) < weekStart ||
            new moment(currentEvent.startDate) > weekEnd
          )
        ) {
          console.log(weekIndex);
        }

        if (new moment(currentEvent.endDate) > weekStart) {
          console.log(weekStart.format("lll"));
          console.log("here");
          break;
        }
      }
    }

    // Week for loop
    // To determine if 5 or 6 weeks are needed in the calendar
    for (let weekIndex = weekStartMonth; weekIndex < 5; weekIndex++) {
      let calendarDayOutlines = [];

      for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
        let calendarDay = new moment(calendarDate)
          .subtract(firstDayOfMonth, "days")
          .add(weekIndex * 7 + dayIndex, "days");

        calendarDayOutlines.push(
          <td key={weekIndex + "day" + dayIndex}>{calendarDay.date()}</td>
        );
      }

      let someArray = [];

      calendarWeekRows.push(
        <table className="test" key={"week" + weekIndex}>
          <thead>
            <tr className="">{calendarDayOutlines}</tr>
          </thead>
          <tbody>{someArray}</tbody>
        </table>
      );
    }

    return <div className="test1">{calendarWeekRows}</div>;
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
