import React, { Component } from "react";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

import GIContainer from "../containers/GIContainer";
import GIText from "../views/GIText";

import {
  amPmDropdown,
  createCalendarWeeks,
  createDayHeaders,
  hourDropdown,
  minuteDropdown
} from "./util";

import "./style.css";

class DatePicker extends Component {
  state = {
    amPmDropdownDisplay: false,
    anchorDates: false,
    anchorDatesOption: this.props.anchorDatesOption ? true : false,
    calendarDropdown: false,
    date: this.props.date,
    displayDate: new moment(this.props.date),
    hourDropdownDisplay: false,
    message: "",
    minuteDropdownDisplay: false
  };

  componentWillReceiveProps(nextProps) {
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
      hourDropdownDisplay: false,
      minuteDropdownDisplay: false,
      amPmDropdownDisplay: false,
      calendarDropdown: false
    });
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
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
  setActive = index => {
    let indexValue = this.state[index];
    indexValue = !indexValue;
    let temp = {
      hourDropdownDisplay: false,
      minuteDropdownDisplay: false,
      amPmDropdownDisplay: false
    };
    temp[index] = indexValue;
    this.setState(temp);
  };

  handleChange = (value, index) => {
    this.setState({ [index]: value });
  };
  render() {
    const {
      amPmDropdownDisplay,
      anchorDates,
      anchorDatesOption,
      calendarDropdown,
      date,
      displayDate,
      hourDropdownDisplay,
      message,
      minuteDropdownDisplay
    } = this.state;
    const {
      className,
      dateLowerBound,
      dateUpperBound,
      disableTime,
      style
    } = this.props;

    const calendarDays = createCalendarWeeks(
      displayDate,
      date,
      dateLowerBound,
      dateUpperBound,
      this.handleChange
    );
    const dayHeaders = createDayHeaders();

    const hours = hourDropdown(date, this.handleChange);
    const minutes = minuteDropdown(date, this.handleChange);
    const amPM = amPmDropdown(date, this.handleChange);

    return (
      <div
        className={"button relative fill-flex " + className}
        ref={this.setWrapperRef}
      >
        <div
          className="common-border bg-white px16 py8 br4"
          onClick={() => {
            this.setActive("calendarDropdown");
            this.setState({ anchorDates: false });
          }}
        >
          <GIText className="bold-600" type="p">
            {date.format("DD MMMM, YYYY")}&nbsp;
            <GIText
              className="green"
              text={date.format("- hh:mm A")}
              type="span"
            ></GIText>
          </GIText>
        </div>
        {calendarDropdown && (
          <GIContainer
            className="absolute top-100 column bg-white shadow z-index-100 pa8"
            style={style}
          >
            <div className="nowrap-container-center">
              <FontAwesomeIcon
                icon={faAngleLeft}
                size="3x"
                color="var(--five-blue-color)"
                className="pl16"
                onClick={this.subtractMonth}
              />

              <h2 className="fill-flex tac">{displayDate.format("MMMM")}</h2>

              <FontAwesomeIcon
                className="pr16"
                onClick={this.addMonth}
                icon={faAngleRight}
                size="3x"
                color="var(--five-blue-color)"
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
                  onClick={() => {
                    this.setActive("hourDropdownDisplay");
                    window.setTimeout(() => {
                      if (document.getElementById(date.format("h") + "hour"))
                        document
                          .getElementById(date.format("h") + "hour")
                          .scrollIntoView();
                    }, 10);
                  }}
                >
                  {date.format("h")} <FontAwesomeIcon icon={faCaretDown} />
                  {hourDropdownDisplay && (
                    <div
                      className="dropdown flex shadow simple-container"
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
                  onClick={() => {
                    this.setActive("minuteDropdownDisplay");
                    window.setTimeout(() => {
                      if (document.getElementById(date.format("mm") + "minute"))
                        document
                          .getElementById(date.format("mm") + "minute")
                          .scrollIntoView();
                    }, 10);
                  }}
                >
                  {date.format("mm")} <FontAwesomeIcon icon={faCaretDown} />
                  {minuteDropdownDisplay && (
                    <div
                      className="dropdown flex shadow simple-container"
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
                  onClick={() => this.setActive("amPmDropdownDisplay")}
                >
                  {date.format("A")} <FontAwesomeIcon icon={faCaretDown} />
                  {amPmDropdownDisplay && (
                    <div
                      className="dropdown flex shadow simple-container"
                      style={{ overflow: "auto", maxHeight: "120px" }}
                    >
                      {amPM}
                    </div>
                  )}
                </div>
              )}
              <button
                className="square-button white px16"
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
          </GIContainer>
        )}
      </div>
    );
  }
}
export default DatePicker;
