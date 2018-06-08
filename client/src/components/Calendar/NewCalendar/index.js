import React, { Component } from "react";
import moment from "moment";

import "./style.css";

class NewCalendar extends Component {
	state = {
		calendarDate: this.props.calendarDate
	};
	createDayHeaders = daysOfWeek => {
		let dayHeadingsArray = [];
		for (let index = 1; index < 8; index++) {
			dayHeadingsArray.push(
				<div className="calendar-day-heading" key={index + "dayheading"}>
					{moment()
						.day(index)
						.format("dddd")}
				</div>
			);
		}
		return dayHeadingsArray;
	};
	createCalendarDays = calendarDate => {
		let slotArray = [];

		let startOfMonth = Number(
			moment(calendarDate.format("M"), "MM")
				.startOf("month")
				.format("d")
		);
		let endOfMonth = Number(
			moment(calendarDate.format("M"), "MM")
				.endOf("month")
				.date()
		);

		for (let index = 1; index <= 35; index++) {
			// Set day to beginning of the month
			let calendarDay = new moment("1", "DD");
			let className = "calendar-day";

			// Check if index is before or after current month
			if (index < startOfMonth || index > endOfMonth + startOfMonth - 1) {
				className += " faded-calendar-days";
			}

			// Subtract the start date of current month
			calendarDay.subtract(startOfMonth, "days");
			// Add our index
			calendarDay.add(index, "days");
			// Now we have the days before the current month ex 27 28 29 30 1 2 3 4

			slotArray.push(
				<div className={className} key={index + "day"}>
					{calendarDay.date()}
					<button className="fa fa-plus calendar-day-plus" />
				</div>
			);
		}
		return slotArray;
	};
	render() {
		let { calendarDate } = this.state;

		let slotArray = this.createCalendarDays(calendarDate);
		let dayHeadingsArray = this.createDayHeaders(moment.weekdays());
		return (
			<div className="test">
				{dayHeadingsArray}
				{slotArray}
			</div>
		);
	}
}

export default NewCalendar;
