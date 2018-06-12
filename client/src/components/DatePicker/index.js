import React, { Component } from "react";
import moment from "moment";
import "./style.css";

class DatePicker extends Component {
	state = {
		inputValue: this.props.date.format(this.props.dateFormat)
	};
	edit = () => {};
	createDayHeaders = daysOfWeek => {
		let dayHeadingsArray = [];
		for (let index = 1; index < 8; index++) {
			dayHeadingsArray.push(
				<div className="date-picker-dropdown-header" key={index + "dayheading"}>
					{moment()
						.day(index)
						.format("dddd")}
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

			calendarDayArray.push(
				<div className={className} onClick={() => this.onSelectDay(calendarDay)} key={index + "day"}>
					<div className="date-picker-date">{calendarDay.date()}</div>
				</div>
			);
		}
		return calendarDayArray;
	};

	onSelectDay = () => {};
	addMonth = () => {
		let { calendarDate } = this.state;
		calendarDate.add(1, "months");
		this.setState({ calendarDate: calendarDate });
	};

	subtractMonth = () => {
		let { calendarDate } = this.state;
		calendarDate.subtract(1, "months");
		this.setState({ calendarDate: calendarDate });
	};

	render() {
		let { date } = this.props;
		let { inputValue } = this.state;
		let calendarDays = this.createCalendarDays(date);

		return (
			<div className="date-picker-dropdown">
				<div className="display-date">{inputValue}</div>
				<div className="dropdown-calendar">{calendarDays}</div>
			</div>
		);
	}
}
export default DatePicker;
