import React, { Component } from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faAngleDown from "@fortawesome/fontawesome-free-solid/faAngleDown";

import "./styles/";

class CalendarPicker extends Component {
  render() {
    const { calendars, activeCalendarIndex, calendarManager } = this.props; // Variable
    const { updateActiveCalendar, createNewCalendar } = this.props; // Functions
    let calendarDivs = [];
    for (let index = 0; index < calendars.length; index++) {
      calendarDivs.push(
        <div
          className={
            index == activeCalendarIndex
              ? "item-colored pa8 active"
              : "item-colored pa8"
          }
          key={`calendar-button-${index}`}
          onClick={() => updateActiveCalendar(index)}
          id={index}
        >
          {calendars[index].calendarName}
        </div>
      );
    }

    if (createNewCalendar) {
      calendarDivs.push(
        <div
          className="item-colored pa8"
          key={"create-new-calendar-button"}
          onClick={() => createNewCalendar(`Calendar ${calendars.length + 1}`)}
        >
          Create New Calendar
        </div>
      );
    }
    if (!calendarManager) {
      calendarDivs.push(
        <div
          className="item-colored pa8"
          key={"calendar-manager-button"}
          onClick={this.props.enableCalendarManager}
        >
          Manage Calendars
        </div>
      );
    }

    return (
      <div className="calendars-container flex silly-font">
        <div className="dropdown-title pa8">
          {calendars && calendars.length >= 0
            ? activeCalendarIndex >= 0
              ? calendars[activeCalendarIndex].calendarName
              : "Change Calendars"
            : "Change Calendars"}
          <FontAwesomeIcon icon={faAngleDown} className="ml8" />
        </div>
        <div className="dropdown">{calendarDivs}</div>
      </div>
    );
  }
}

export default CalendarPicker;
