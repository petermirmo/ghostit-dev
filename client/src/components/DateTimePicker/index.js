import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faCaretDown from "@fortawesome/fontawesome-free-solid/faCaretDown";
import faAngleLeft from "@fortawesome/fontawesome-free-solid/faAngleLeft";
import faAngleRight from "@fortawesome/fontawesome-free-solid/faAngleRight";
import moment from "moment-timezone";

import "./style.css";

class DatePicker extends Component {
  state = {
    inputValue: this.props.date.format(this.props.dateFormat),
    calendarDropdown: false,
    hourDropdown: false,
    minuteDropdown: false,
    amPmDropdown: false,
    displayDate: new moment(this.props.date),
    message: "",
    date: this.props.date,
    anchorDatesOption: this.props.anchorDatesOption ? true : false,
    anchorDates: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.date && nextProps.dateFormat)
      this.setState({
        inputValue: nextProps.date.format(nextProps.dateFormat)
      });
    if (nextProps.date) this.setState({ date: nextProps.date });
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (!this.wrapperRef) return;

    if (this.wrapperRef.contains(event.target)) {
      return;
    }

    this.setState({
      message: "",
      date: this.props.date,
      hourDropdown: false,
      minuteDropdown: false,
      amPmDropdown: false,
      calendarDropdown: false
    });
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  createDayHeaders = () => {
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
  createCalendarWeeks = calendarDate => {
    const { date } = this.state;
    let { dateLowerBound, dateUpperBound } = this.props;

    let calendarWeekArray = [];

    // Used to see which day the month starts on, does it start on a Monday or Sunday or Tuesday...
    let firstDayOfMonth = Number(
      moment(calendarDate.format("M"), "MM")
        .startOf("month")
        .format("d")
    );

    // Used to see which day the month ends on, 29 or 30 or 31 ...
    let endOfMonth = Number(
      moment(calendarDate.format("M"), "MM")
        .endOf("month")
        .date()
    );

    // To determine if 42 or 35 days in the calendar should be displayed
    let lowerBound = 1;
    let weekStartMonth = firstDayOfMonth === 0 ? -1 : 0;

    for (let weekIndex = weekStartMonth; weekIndex < 5; weekIndex++) {
      let calendarDayArray = [];

      for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
        let calendarDay = new moment(calendarDate);
        calendarDay = calendarDay.date(1);

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
              onClick={() => this.handleChange(calendarDay, "date")}
              key={dayIndex + "day" + weekIndex}
            >
              <div className="date-picker-date">{calendarDay.date()}</div>
            </div>
          );
        } else {
          calendarDayArray.push(
            <div className="past-calendar-date" key={dayIndex + "day"}>
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

  addMonth = () => {
    let { displayDate } = this.state;
    displayDate.add(1, "months");
    this.setState({ displayDate });
  };

  subtractMonth = () => {
    let { displayDate } = this.state;
    displayDate.subtract(1, "months");
    this.setState({ displayDate });
  };
  hourDropdown = date => {
    let tempDate = new moment(date);

    let hourDivs = [];
    let extraHours = 0;
    let isPM = tempDate.format("HH") > 12;
    if (isPM) extraHours = 12;
    for (let index = 0; index <= 11; index++) {
      let newDate = new moment(tempDate.hours(index + extraHours));

      hourDivs.push(
        <div
          className="item-colored"
          key={index + "hour"}
          onClick={() => this.handleChange(newDate, "date")}
        >
          {tempDate.format("h")}
        </div>
      );
    }

    return hourDivs;
  };
  minuteDropdown = date => {
    let tempDate = new moment(date);

    let minuteDivs = [];
    for (let index = 0; index <= 59; index++) {
      let newDate = new moment(tempDate.minutes(index));

      minuteDivs.push(
        <div
          className="item-colored"
          key={index + "minute"}
          onClick={() => this.handleChange(newDate, "date")}
        >
          {tempDate.format("mm")}
        </div>
      );
    }

    return minuteDivs;
  };
  amPmDropdown = date => {
    let tempDate = new moment(date);

    let minuteDivs = [];
    let isAM = tempDate.format("HH") < 12;

    let newDate = new moment(tempDate);
    if (!isAM) newDate = new moment(tempDate.subtract(12, "hours"));
    minuteDivs.push(
      <div
        className="item-colored"
        key="am"
        onClick={() => this.handleChange(newDate, "date")}
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
        onClick={() => this.handleChange(newDate2, "date")}
      >
        {newDate2.format("A")}
      </div>
    );

    return minuteDivs;
  };
  setActive = index => {
    let indexValue = this.state[index];
    indexValue = !indexValue;
    this.setState({ [index]: indexValue });
  };

  handleChange = (value, index) => {
    this.setState({ [index]: value });
  };
  render() {
    const {
      inputValue,
      calendarDropdown,
      hourDropdown,
      minuteDropdown,
      amPmDropdown,
      displayDate,
      message,
      date,
      anchorDatesOption,
      anchorDates
    } = this.state;
    const { style, disableTime, className } = this.props;

    let calendarDays = this.createCalendarWeeks(displayDate);
    let dayHeaders = this.createDayHeaders();

    let hours = this.hourDropdown(date);
    let minutes = this.minuteDropdown(date);
    let amPM = this.amPmDropdown(date);

    return (
      <div
        className={"button relative flex1 " + className}
        ref={this.setWrapperRef}
      >
        <div
          className="display-date"
          onClick={() => {
            this.setActive("calendarDropdown");
            this.setState({ anchorDates: false });
          }}
        >
          {inputValue}
        </div>
        {calendarDropdown && (
          <div
            className="dropdown flex simple-container common-shadow pa8"
            style={style}
          >
            <div className="nowrap-container-center">
              <FontAwesomeIcon
                icon={faAngleLeft}
                size="3x"
                color="var(--five-primary-color)"
                className="pl16"
                onClick={this.subtractMonth}
              />

              <h2 className="flex1 tac">{displayDate.format("MMMM")}</h2>

              <FontAwesomeIcon
                className="pr16"
                onClick={this.addMonth}
                icon={faAngleRight}
                size="3x"
                color="var(--five-primary-color)"
              />
            </div>
            {message && message !== "" && (
              <div className="date-picker-message">{message}</div>
            )}
            <div className="nowrap-container">{dayHeaders}</div>
            <div className="wrapping-container">{calendarDays}</div>
            <div className="nowrap-container py4">
              {!disableTime && (
                <div
                  className="time-dropdown mr4 pa4"
                  onClick={() => this.setActive("hourDropdown")}
                >
                  {date.format("h")} <FontAwesomeIcon icon={faCaretDown} />
                  {hourDropdown && (
                    <div
                      className="dropdown flex common-shadow simple-container"
                      style={{ overflow: "auto", maxHeight: "120px" }}
                    >
                      {hours}
                    </div>
                  )}
                </div>
              )}
              {!disableTime && (
                <div
                  className="time-dropdown mr4 pa4"
                  onClick={() => this.setActive("minuteDropdown")}
                >
                  {date.format("mm")} <FontAwesomeIcon icon={faCaretDown} />
                  {minuteDropdown && (
                    <div
                      className="dropdown flex common-shadow simple-container"
                      style={{ overflow: "auto", maxHeight: "120px" }}
                    >
                      {minutes}
                    </div>
                  )}
                </div>
              )}
              {!disableTime && (
                <div
                  className="time-dropdown mr4 pa4"
                  onClick={() => this.setActive("amPmDropdown")}
                >
                  {date.format("A")} <FontAwesomeIcon icon={faCaretDown} />
                  {amPmDropdown && (
                    <div
                      className="dropdown flex common-shadow simple-container"
                      style={{ overflow: "auto", maxHeight: "120px" }}
                    >
                      {amPM}
                    </div>
                  )}
                </div>
              )}
              <button
                className="square-button px16"
                onClick={() => {
                  this.setActive("calendarDropdown");
                  this.props.handleChange(
                    date,
                    (dropdown, message) => {
                      this.setState({ calendarDropdown: dropdown, message });
                    },
                    anchorDates
                  );
                }}
              >
                Confirm
              </button>
            </div>
            {anchorDatesOption && (
              <div
                className="anchor-dates-checkbox"
                title="This option moves all dates (posts and campaign start and end) the same amount."
                onClick={() => this.setState({ anchorDates: !anchorDates })}
              >
                <input type="checkbox" checked={anchorDates} />
                Anchor Dates
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default DatePicker;
