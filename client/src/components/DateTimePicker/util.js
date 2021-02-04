import React from "react";
import moment from "moment-timezone";

export const amPmDropdown = (date, handleChange) => {
  let tempDate = new moment(date);

  let minuteDivs = [];
  let isAM = tempDate.format("HH") < 12;

  let newDate = new moment(tempDate);
  if (!isAM) newDate = new moment(tempDate.subtract(12, "hours"));
  minuteDivs.push(
    <div
      className="item-colored"
      key="am"
      onClick={() => handleChange(newDate, "date")}
    >
      {newDate.format("A")}
    </div>
  );
  let newDate2 = new moment(newDate);
  isAM = newDate.format("HH") < 12;
  if (isAM) newDate2 = new moment(newDate).add(12, "hours");

  minuteDivs.push(
    <div
      className="item-colored"
      key="pm"
      onClick={() => handleChange(newDate2, "date")}
    >
      {newDate2.format("A")}
    </div>
  );

  return minuteDivs;
};

export const createCalendarWeeks = (
  calendarDate,
  date,
  dateLowerBound,
  dateUpperBound,
  handleChange
) => {
  let calendarWeekArray = [];
  calendarDate.date(1);

  // Used to see which day the month starts on, does it start on a Monday or Sunday or Tuesday...
  let firstDayOfMonth = calendarDate.day();

  // To determine if 42 or 35 days in the calendar should be displayed
  let weekStartMonth = firstDayOfMonth === 0 ? -1 : 0;

  let weekEndMonth =
    firstDayOfMonth + calendarDate.daysInMonth() > 35 && weekStartMonth !== -1
      ? 6
      : 5;

  for (let weekIndex = weekStartMonth; weekIndex < weekEndMonth; weekIndex++) {
    let calendarDayArray = [];

    for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
      let calendarDay = new moment(calendarDate);

      // Subtract the start date of current month
      calendarDay.subtract(firstDayOfMonth, "days");
      // Add our index
      calendarDay.add(weekIndex * 7 + dayIndex, "days");

      let pastDate = calendarDay.diff(new moment(), "days") < 0;

      let className = "date-picker-day";

      // Check if index is before or after current month
      if (pastDate) {
        className += " faded-date-picker-days";
      }
      if (calendarDay.format("YYYY-MM-DD") === date.format("YYYY-MM-DD")) {
        className += " active";
      }

      if (
        (calendarDay.format("YYYY-MM-DD") >=
          dateLowerBound.format("YYYY-MM-DD") ||
          !dateLowerBound) &&
        (calendarDay <= dateUpperBound || !dateUpperBound)
      ) {
        calendarDayArray.push(
          <div
            className={className}
            onClick={() => handleChange(calendarDay, "date")}
            key={dayIndex + "day" + weekIndex}
          >
            <div className="date-picker-date">{calendarDay.date()}</div>
          </div>
        );
      } else {
        calendarDayArray.push(
          <div
            className="past-calendar-date faded-date-picker-days"
            key={dayIndex + "day"}
          >
            <div className="date-picker-date">{calendarDay.date()}</div>
          </div>
        );
      }
    }
    calendarWeekArray.push(
      <div className="nowrap-container" key={weekIndex + "day"}>
        {calendarDayArray}
      </div>
    );
  }
  return calendarWeekArray;
};

export const createDayHeaders = () => {
  let dayHeadingsArray = [];
  for (let index = 0; index < 7; index++) {
    dayHeadingsArray.push(
      <div
        className="date-picker-dropdown-header py4"
        key={index + "dayheading"}
      >
        {moment()
          .day(index)
          .format("dddd")
          .substring(0, 2)}
      </div>
    );
  }
  return dayHeadingsArray;
};

export const hourDropdown = (date, handleChange) => {
  let tempDate = new moment(date);

  let hourDivs = [];
  let extraHours = 0;
  let isPM = tempDate.format("HH") >= 12;

  if (isPM) extraHours = 12;

  for (let index = 0; index <= 11; index++) {
    let newDate = new moment(tempDate.hours(index + extraHours));

    hourDivs.push(
      <div
        className="item-colored"
        id={index + "hour"}
        key={index}
        onClick={() => handleChange(newDate, "date")}
      >
        {tempDate.format("h")}
      </div>
    );
  }

  return hourDivs;
};

export const minuteDropdown = (date, handleChange) => {
  let tempDate = new moment(date);

  let minuteDivs = [];
  for (let index = 0; index <= 59; index++) {
    let newDate = new moment(tempDate.minutes(index));

    minuteDivs.push(
      <div
        className="item-colored"
        id={tempDate.format("mm") + "minute"}
        key={index}
        onClick={() => handleChange(newDate, "date")}
      >
        {tempDate.format("mm")}
      </div>
    );
  }

  return minuteDivs;
};
