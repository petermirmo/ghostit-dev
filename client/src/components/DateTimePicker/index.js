import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faCaretDown from "@fortawesome/fontawesome-free-solid/faCaretDown";
import faAngleLeft from "@fortawesome/fontawesome-free-solid/faAngleLeft";
import faAngleRight from "@fortawesome/fontawesome-free-solid/faAngleRight";
import moment from "moment-timezone";

import "./styles/";

class DatePicker extends Component {
	state = {
		inputValue: this.props.date.format(this.props.dateFormat),
		calendarDropdown: false,
		hourDropdown: false,
		minuteDropdown: false,
		amPmDropdown: false,
		displayDate: new moment(this.props.date),
		message: ""
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.date && nextProps.dateFormat)
			this.setState({ inputValue: nextProps.date.format(nextProps.dateFormat) });
		if (nextProps.message) {
			this.setState({ message: nextProps.message });
		}
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

		let { hourDropdown, minuteDropdown, amPmDropdown, calendarDropdown } = this.state;
		if (hourDropdown) {
			this.setState({ hourDropdown: false });
		} else if (minuteDropdown) {
			this.setState({ minuteDropdown: false });
		} else if (amPmDropdown) {
			this.setState({ amPmDropdown: false });
		} else if (calendarDropdown) {
			this.setState({ calendarDropdown: false });
		}
	};

	setWrapperRef = node => {
		this.wrapperRef = node;
	};

	createDayHeaders = () => {
		let dayHeadingsArray = [];
		for (let index = 1; index < 8; index++) {
			dayHeadingsArray.push(
				<div className="date-picker-dropdown-header" key={index + "dayheading"}>
					{moment()
						.day(index)
						.format("dddd")
						.substring(0, 2)}
				</div>
			);
		}
		return dayHeadingsArray;
	};
	createCalendarDays = calendarDate => {
		let { dateLowerBound, dateUpperBound } = this.props;

		let calendarDayArray = [];

		// Used to see which day the month starts on, does it start on a Monday or Sunday or Tuesday...
		let startOfMonth = Number(
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
		if (startOfMonth === 0) lowerBound = -6;

		for (let index = lowerBound; index <= 35; index++) {
			// Set day to beginning of the month
			let calendarDay = new moment(calendarDate);
			calendarDay = calendarDay.date(1);

			// Subtract the start date of current month
			calendarDay.subtract(startOfMonth, "days");
			// Add our index
			calendarDay.add(index, "days");
			// Now we have the days before the current month ex 27 28 29 30 1 2 3 4

			calendarDay.set("hour", this.props.date.get('hour'));
			calendarDay.set("minute", this.props.date.get('minute'));

			let className = "date-picker-day";

			// Check if index is before or after current month
			if (index < startOfMonth || index > endOfMonth + startOfMonth - 1) {
				className += " faded-date-picker-days";
			}
			if (calendarDay.format("YYYY-MM-DD") === this.props.date.format("YYYY-MM-DD")) {
				className += " active";
			}

			if ((calendarDay.format("YYYY-MM-DD") >= dateLowerBound.format("YYYY-MM-DD") || !dateLowerBound) && (calendarDay <= dateUpperBound || !dateUpperBound)) {
				calendarDayArray.push(
					<div className={className} onClick={() => this.props.handleChange(calendarDay)} key={index + "day"}>
						<div className="date-picker-date">{calendarDay.date()}</div>
					</div>
				);
			} else {
				calendarDayArray.push(
					<div className="past-calendar-date" key={index + "day"}>
						<div className="date-picker-date">{calendarDay.date()}</div>
					</div>
				);
			}
		}
		return calendarDayArray;
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
				<div className="time-dropdown-item" key={index + "hour"} onClick={() => this.props.handleChange(newDate)}>
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
				<div className="time-dropdown-item" key={index + "minute"} onClick={() => this.props.handleChange(newDate)}>
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
			<div className="time-dropdown-item" key="am" onClick={() => this.props.handleChange(newDate)}>
				{newDate.format("A")}
			</div>
		);
		let newDate2 = new moment(newDate);
		isAM = newDate.format("HH") < 12;
		if (isAM) newDate2 = new moment(newDate).add(12, "hours");

		minuteDivs.push(
			<div className="time-dropdown-item" key="pm" onClick={() => this.props.handleChange(newDate2)}>
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

	handleChange = () => {};
	render() {
		console.log("date-picker state then props:");
		console.log(this.state);
		console.log(this.props);
		let { inputValue, calendarDropdown, hourDropdown, minuteDropdown, amPmDropdown, displayDate, message } = this.state;
		let { date, style, disableTime } = this.props;

		let calendarDays = this.createCalendarDays(displayDate);
		let dayHeaders = this.createDayHeaders();

		let hours = this.hourDropdown(date);
		let minutes = this.minuteDropdown(date);
		let amPM = this.amPmDropdown(date);

		return (
			<div className="date-picker-dropdown" ref={this.setWrapperRef}>
				<div className="display-date" onClick={() => this.setActive("calendarDropdown")}>
					{inputValue}
				</div>
				{calendarDropdown && (
					<div className="dropdown-calendar" style={style}>
						<div className="date-picker-calendar-month-container">
							<span className="date-picker-calendar-month-switch-button left" onClick={this.subtractMonth}>
								<FontAwesomeIcon icon={faAngleLeft} size="3x" color="var(--blue-theme-color)" />
							</span>
							<h2 className="date-picker-calendar-month">{displayDate.format("MMMM")}</h2>

							<span className="date-picker-calendar-month-switch-button right" onClick={this.addMonth}>
								<FontAwesomeIcon icon={faAngleRight} size="3x" color="var(--blue-theme-color)" />
							</span>
						</div>
						{message && message !== "" && (
							<div className="date-picker-message">{message}</div>
						)}
						{dayHeaders}
						{calendarDays}
						<div className="time-container">
							{!disableTime && (
								<div className="time-dropdown" onClick={() => this.setActive("hourDropdown")}>
									{date.format("h")} <FontAwesomeIcon icon={faCaretDown} />
									{hourDropdown && <div className="time-dropdown-container">{hours}</div>}
								</div>
							)}
							{!disableTime && (
								<div className="time-dropdown" onClick={() => this.setActive("minuteDropdown")}>
									{date.format("mm")} <FontAwesomeIcon icon={faCaretDown} />
									{minuteDropdown && <div className="time-dropdown-container">{minutes}</div>}
								</div>
							)}
							{!disableTime && (
								<div className="time-dropdown" onClick={() => this.setActive("amPmDropdown")}>
									{date.format("A")} <FontAwesomeIcon icon={faCaretDown} />
									{amPmDropdown && <div className="time-dropdown-container">{amPM}</div>}
								</div>
							)}
							<button
								className="finished-button"
								onClick={() => {
									this.setActive("calendarDropdown");
									this.props.handleChange(date);
								}}
							>
								Done!
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}
}
export default DatePicker;
