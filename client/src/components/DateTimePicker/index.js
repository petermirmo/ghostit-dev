import React, { Component } from "react";
import moment from "moment";

import "./styles/";

class DatePicker extends Component {
	state = {
		inputValue: this.props.date.format(this.props.dateFormat),
		calendarDropdown: false,
		hourDropdown: false,
		minuteDropdown: false,
		amPmDropdown: false
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.date && nextProps.dateFormat)
			this.setState({ inputValue: nextProps.date.format(nextProps.dateFormat) });
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

			let className = "date-picker-day";

			// Check if index is before or after current month
			if (index < startOfMonth || index > endOfMonth + startOfMonth - 1) {
				className += " faded-date-picker-days";
			}
			if (calendarDay.isSame(calendarDate, "day")) {
				className += " active";
			}

			calendarDayArray.push(
				<div className={className} onClick={() => this.props.onChange(calendarDay)} key={index + "day"}>
					<div className="date-picker-date">{calendarDay.date()}</div>
				</div>
			);
		}
		return calendarDayArray;
	};

	addMonth = () => {
		let { date } = this.props;
		date.add(1, "months");
		this.props.onChange(date);
	};

	subtractMonth = () => {
		let { date } = this.props;
		date.subtract(1, "months");
		this.props.onChange(date);
	};
	hourDropdown = date => {
		let tempDate = new moment(date);

		let hourDivs = [];
		for (let index = 0; index <= 11; index++) {
			let newDate = new moment(tempDate.hours(index));

			hourDivs.push(
				<div className="time-dropdown-item" key={index + "hour"} onClick={() => this.props.onChange(newDate)}>
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
				<div className="time-dropdown-item" key={index + "minute"} onClick={() => this.props.onChange(newDate)}>
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
			<div className="time-dropdown-item" key="am" onClick={() => this.props.onChange(newDate)}>
				{newDate.format("A")}
			</div>
		);
		let newDate2 = new moment(newDate);
		isAM = newDate.format("HH") < 12;
		if (isAM) newDate2 = new moment(newDate).add(12, "hours");

		minuteDivs.push(
			<div className="time-dropdown-item" key="pm" onClick={() => this.props.onChange(newDate2)}>
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
	render() {
		let { inputValue, calendarDropdown, hourDropdown, minuteDropdown, amPmDropdown } = this.state;
		let { date, style } = this.props;

		let calendarDays = this.createCalendarDays(date);
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
							<button
								className="date-picker-calendar-month-switch-button left fa fa-angle-left fa-3x"
								onClick={this.subtractMonth}
							/>
							<h2 className="date-picker-calendar-month">{date.format("MMMM")}</h2>
							<button
								className="date-picker-calendar-month-switch-button right fa fa-angle-right fa-3x"
								onClick={this.addMonth}
							/>
						</div>
						{dayHeaders}
						{calendarDays}
						<div className="time-dropdown" onClick={() => this.setActive("hourDropdown")}>
							{date.format("h")} <div className="fa fa-caret-down" />
							{hourDropdown && <div className="time-dropdown-container">{hours}</div>}
						</div>
						<div className="time-dropdown" onClick={() => this.setActive("minuteDropdown")}>
							{date.format("mm")} <div className="fa fa-caret-down" />
							{minuteDropdown && <div className="time-dropdown-container">{minutes}</div>}
						</div>
						<div className="time-dropdown" onClick={() => this.setActive("amPmDropdown")}>
							{date.format("A")} <div className="fa fa-caret-down" />
							{amPmDropdown && <div className="time-dropdown-container">{amPM}</div>}
						</div>
						<button className="finished-button center" onClick={() => this.setActive("calendarDropdown")}>
							Done!
						</button>
					</div>
				)}
			</div>
		);
	}
}
export default DatePicker;
