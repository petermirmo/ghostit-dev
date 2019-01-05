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

  convertEventsToCalendarArray = (
    firstDayOfMonth,
    weekStartMonth,
    events,
    calendarDate
  ) => {
    let calendarWeekArray = [];
    for (let weekIndex = weekStartMonth; weekIndex < 5; weekIndex++) {
      calendarWeekArray.push([[0, 0, 0, 0, 0, 0, 0]]);
    }
    let rowIndex = 0;

    for (let index in events) {
      let currentEvent = events[index];

      let canCampaignFitInRow = this.loopThroughCalendarArray(
        firstDayOfMonth,
        weekStartMonth,
        events,
        calendarDate,
        rowIndex,
        currentEvent,
        calendarWeekArray,
        true
      );
      while (!canCampaignFitInRow) {
        if (canCampaignFitInRow) break;
        canCampaignFitInRow = this.loopThroughCalendarArray(
          firstDayOfMonth,
          weekStartMonth,
          events,
          calendarDate,
          rowIndex,
          currentEvent,
          calendarWeekArray,
          true
        );
        rowIndex++;
      }

      calendarWeekArray = this.loopThroughCalendarArray(
        firstDayOfMonth,
        weekStartMonth,
        events,
        calendarDate,
        rowIndex,
        currentEvent,
        calendarWeekArray
      );
    }

    return calendarWeekArray;
  };

  loopThroughCalendarArray = (
    firstDayOfMonth,
    weekStartMonth,
    events,
    calendarDate,
    rowIndex,
    currentEvent,
    calendarWeekArray,
    canCampaignFitInRow
  ) => {
    let campaignFitCheck;
    if (canCampaignFitInRow) campaignFitCheck = true;
    for (let weekIndex = weekStartMonth; weekIndex < 5; weekIndex++) {
      let weekStart = new moment(calendarDate)
        .subtract(firstDayOfMonth, "days")
        .add(weekIndex * 7, "days")
        .startOf("day");

      let weekEnd = new moment(weekStart).add(6, "days").endOf("day");

      if (
        !(
          new moment(currentEvent.endDate) < weekStart ||
          weekEnd < new moment(currentEvent.startDate)
        )
      ) {
        for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
          let calendarDay = new moment(calendarDate)
            .subtract(firstDayOfMonth, "days")
            .add(weekIndex * 7 + dayIndex, "days");
          if (
            calendarDay >= new moment(currentEvent.startDate) &&
            calendarDay <= new moment(currentEvent.endDate)
          ) {
            if (!canCampaignFitInRow) {
              if (!calendarWeekArray[weekIndex][rowIndex])
                calendarWeekArray[weekIndex][rowIndex] = [0, 0, 0, 0, 0, 0, 0];
              if (new moment(currentEvent.startDate).isSame(calendarDay, "day"))
                calendarWeekArray[weekIndex][rowIndex][dayIndex] = new moment(
                  currentEvent.endDate
                ).diff(new moment(currentEvent.startDate), "days");
              else calendarWeekArray[weekIndex][rowIndex][dayIndex] = -1;
            } else {
              if (!calendarWeekArray[weekIndex][rowIndex])
                calendarWeekArray[weekIndex][rowIndex] = [0, 0, 0, 0, 0, 0, 0];
              if (calendarWeekArray[weekIndex][rowIndex][dayIndex] !== 0) {
                canCampaignFitInRow = false;
                break;
              }
            }
          }
        }
      }
    }
    if (!campaignFitCheck) return calendarWeekArray;
    else return canCampaignFitInRow;
  };

  calendarDate = (calendarDate, firstDayOfMonth, i, j) => {
    return new moment(calendarDate)
      .subtract(firstDayOfMonth, "days")
      .add(i * 7 + j, "days")
      .date();
  };

  render() {
    let events = this.props.calendarEvents;
    let calendarDate = new moment().date(1);

    // Used to see which day the month starts on, does it start on a Monday or Sunday or Tuesday...
    let firstDayOfMonth = moment(calendarDate).weekday();

    let weekStartMonth = firstDayOfMonth === 0 ? -1 : 0;

    let calendarArray = this.convertEventsToCalendarArray(
      firstDayOfMonth,
      weekStartMonth,
      events,
      calendarDate
    );
    let weekArrayDivs = [];

    for (let weekIndex = 0; weekIndex < calendarArray.length; weekIndex++) {
      let weekArray = calendarArray[weekIndex];
      let someDivs = [];

      for (let rowIndex = 0; rowIndex < weekArray.length; rowIndex++) {
        let rowArray = weekArray[rowIndex];
        let someOtherDivs = [];
        let dayLabels = [];

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          let day = rowArray[dayIndex];
          dayLabels.push(
            <th key={dayIndex + "fsd" + weekIndex}>
              {this.calendarDate(
                calendarDate,
                firstDayOfMonth,
                weekIndex,
                dayIndex
              )}
            </th>
          );
          if (day > 0) {
            someOtherDivs.push(
              <td
                key={dayIndex + "value" + weekIndex}
                colSpan={7 - dayIndex}
                className="test"
              >
                {day}
              </td>
            );
            dayIndex += 7 - dayIndex;
          } else if (day === 0)
            someOtherDivs.push(
              <td
                key={dayIndex + "value" + weekIndex}
                colSpan={day}
                className="test2"
              />
            );
          else {
            someOtherDivs.push(
              <td
                key={dayIndex + "value" + weekIndex}
                colSpan={day}
                className="test3"
              />
            );
          }
        }
        someDivs.push(
          <tr key={"calendar-row" + rowIndex}>
            <td>
              <table className="calendar-row-container">
                <thead>
                  <tr>{dayLabels}</tr>
                </thead>

                <tbody>
                  <tr>{someOtherDivs}</tr>
                </tbody>
              </table>
            </td>
          </tr>
        );
      }

      weekArrayDivs.push(
        <tr key={"calendar-week" + weekIndex}>
          <td>
            <table className="calendar-week-container">
              <tbody>{someDivs}</tbody>
            </table>
          </td>
        </tr>
      );
    }

    let calendar = (
      <table className="calendar-month-container">
        <tbody>{weekArrayDivs}</tbody>
      </table>
    );

    return <div className="test1">{calendar}</div>;
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
