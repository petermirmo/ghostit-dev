import React, { Component } from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faAngleDown from "@fortawesome/fontawesome-free-solid/faAngleDown";

import "./style.css";

class CalendarPicker extends Component {
  render() {
    const { calendars, activeCalendarIndex, calendarManager } = this.props; // Variable
    const {
      updateActiveCalendar,
      createNewCalendar,
      enableCalendarManager
    } = this.props; // Functions

    let calendarDivs = [];
    for (let index = 0; index < calendars.length; index++) {
      calendarDivs.push(
        <div
          className="item-colored px16 py8 common-transition"
          key={`calendar-button-${index}`}
          onClick={() => updateActiveCalendar(index)}
        >
          {calendars[index].calendarName}
        </div>
      );
    }

    if (createNewCalendar) {
      calendarDivs.push(
        <div
          className="item-colored px16 py8"
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
          className="dropdown-bottom-button item-colored px16 py8"
          key={"calendar-manager-button"}
          onClick={enableCalendarManager}
        >
          Manage Calendars
        </div>
      );
    }

    return (
      <div className="calendars-container flex relative button silly-font">
        <div className="dropdown-title py8">
          {calendars && calendars.length >= 0
            ? activeCalendarIndex >= 0
              ? calendars[activeCalendarIndex].calendarName
              : "Change Calendars"
            : "Change Calendars"}
          <FontAwesomeIcon icon={faAngleDown} className="ml8" />
        </div>
        <div className="dropdown center transparent">
          <div className="absolute-child-center common-shadow br4">
            {calendarDivs}
          </div>
        </div>
      </div>
    );
  }
}

export default CalendarPicker;
