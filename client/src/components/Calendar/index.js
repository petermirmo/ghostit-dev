import React, { Component } from "react";
import moment from "moment-timezone";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlus from "@fortawesome/fontawesome-free-solid/faPlus";
import faAngleLeft from "@fortawesome/fontawesome-free-solid/faAngleLeft";
import faAngleRight from "@fortawesome/fontawesome-free-solid/faAngleRight";

import "./styles/";

class NewCalendar extends Component {
	state = {
		calendarDate: this.props.calendarDate,
		timezone: this.props.timezone
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.timezone !== this.state.timezone)
			this.setState({ calendarDate: nextProps.calendarDate, timezone: nextProps.timezone });
	}
	createDayHeaders = () => {
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

		const { postsToDisplay, onSelectDay, onSelectPost } = this.props;

		postsToDisplay.sort(compare);
		let postToDisplayIndex = 0;

		for (let index = lowerBound; index <= 35; index++) {
			// Set day to beginning of the month
			let calendarDay = new moment(calendarDate);
			calendarDay = calendarDay.date(1);

			// Subtract the start date of current month
			calendarDay.subtract(startOfMonth, "days");
			// Add our index
			calendarDay.add(index, "days");
			// Now we have the days before the current month ex 27 28 29 30 1 2 3 4

			let postsForDay = [];
			let content = "";
			// Algorithm to get the posts for each day in the calendar
			if (postsToDisplay) {
				if (postsToDisplay[postToDisplayIndex]) {
					while (
						moment(postsToDisplay[postToDisplayIndex].postingDate).format("YYYY-MM-DD") ===
						calendarDay.format("YYYY-MM-DD")
					) {
						let post = postsToDisplay[postToDisplayIndex];
						if (post.content) content = post.content;
						if (post.title) content = post.title;
						if (post.notes) content = post.notes;
						let color = "var(--blue-theme-color)";
						if (post.color) color = post.color;
						if (post.eventColor) color = post.eventColor;

						let icon;
						if (post.socialType === "facebook") icon = "fa fa-facebook";
						if (post.socialType === "twitter") icon = "fa fa-twitter";
						if (post.socialType === "linkedin") icon = "fa fa-linkedin";

						postsForDay.push(
							<div
								className="calendar-post"
								onClick={event => {
									event.stopPropagation();
									onSelectPost(post);
								}}
								style={{ backgroundColor: color }}
								key={postToDisplayIndex + "post"}
							>
								{icon && <div className={icon} />} {new moment(post.postingDate).format("h:mm")} {content}
							</div>
						);

						postToDisplayIndex++;
						if (postToDisplayIndex >= postsToDisplay.length) break;
					}
					if (postsToDisplay[postToDisplayIndex]) {
						while (
							moment(postsToDisplay[postToDisplayIndex].postingDate).format("YYYY-MM-DD") <
							calendarDay.format("YYYY-MM-DD")
						) {
							postToDisplayIndex++;
							if (postToDisplayIndex >= postsToDisplay.length) break;
						}
					}
				}
			}
			let className = "calendar-day";

			// Check if index is before or after current month
			if (index < startOfMonth || index > endOfMonth + startOfMonth - 1) {
				className += " faded-calendar-days";
			}

			calendarDayArray.push(
				<div className={className} onClick={() => onSelectDay(calendarDay)} key={index + "day"}>
					<div className="calendar-day-date">{calendarDay.date()}</div>
					<span className="calendar-day-plus">
						<FontAwesomeIcon icon={faPlus} color="var(--blue-theme-color)" />
					</span>
					{postsForDay}
				</div>
			);
		}
		return calendarDayArray;
	};
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
		let { calendarDate } = this.state;

		let calendarDayArray = this.createCalendarDays(calendarDate);
		let dayHeadingsArray = this.createDayHeaders(moment.weekdays());
		return (
			<div className="calendar-container">
				<div className="calendar-header-container">
					<span className="calendar-switch-month-button left" onClick={this.subtractMonth}>
						<FontAwesomeIcon icon={faAngleLeft} size="4x" color="var(--blue-theme-color)" />
					</span>
					<h1 className="calendar-header center">{calendarDate.format("MMMM")}</h1>
					<span className="calendar-switch-month-button right" onClick={this.addMonth}>
						<FontAwesomeIcon icon={faAngleRight} size="4x" color="var(--blue-theme-color)" />
					</span>
				</div>

				<div className="calendar-table">
					{dayHeadingsArray}
					{calendarDayArray}
				</div>
			</div>
		);
	}
}
function compare(a, b) {
	if (a.postingDate < b.postingDate) return -1;
	if (a.postingDate > b.postingDate) return 1;
	return 0;
}
export default NewCalendar;
