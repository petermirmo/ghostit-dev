import React, { Component } from "react";
import Textarea from "react-textarea-autosize";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import NavigationBar from "../../components/Navigations/NavigationBar";

class WritersBriefForm extends Component {
	state = {
		writersBrief: this.props.writersBrief,
		socialCategories: { facebook: true, instagram: false, twitter: false, linkedin: false }
	};
	componentWillReceiveProps(nextProps) {
		this.setState({ writersBrief: nextProps.writersBrief });
	}
	handleChange = () => {};
	handleDateChange = (date, index) => {
		let { writersBrief } = this.state;
		writersBrief[index] = date;
		this.setState({ writersBrief: writersBrief });
	};
	addNewIndexToWritersBriefArray = index => {
		let { writersBrief } = this.state;
		let array = writersBrief[index];

		array.push({ type: undefined, notes: "" });
		this.setState({ [index]: array });
	};
	updateSocialTextarea = event => {
		// Remove active class from last tab
		let { socialCategories } = this.state;
		for (let index in socialCategories) {
			socialCategories[index] = false;
		}
		socialCategories[event.target.id] = true;
		this.setState({ socialCategories: socialCategories });
	};
	render() {
		let { writersBrief, socialCategories } = this.state;
		let { cycleStartDate, cycleEndDate, socialPosts } = writersBrief;

		let activeTab;
		for (let index in socialCategories) {
			if (socialCategories[index]) activeTab = index;
		}
		return (
			<div className="writers-brief-form center">
				<p className="date-label center">Content cycle start: </p>
				<DatePicker
					className="date-picker center"
					selected={cycleStartDate}
					onChange={date => this.handleDateChange(date, "cycleStartDate")}
					dateFormat="MMMM Do YYYY"
				/>

				<p className="date-label">Content cycle end: </p>
				<DatePicker
					className="date-picker center"
					selected={cycleEndDate}
					onChange={date => this.handleDateChange(date, "cycleEndDate")}
					dateFormat="MMMM Do YYYY"
				/>

				<NavigationBar updateParentState={this.updateSocialTextarea} categories={socialCategories} />
				<p>Social Media Notes and Instructions ({activeTab}):</p>
				<Textarea
					className="textarea-social"
					placeholder="- funny and upbeat"
					value={socialPosts[activeTab]}
					onChange={event => this.something("index", event.target.value)}
				/>

				<div className="container-something">
					<button
						className="fa fa-plus fa-2x add-new"
						onClick={() => this.addNewIndexToWritersBriefArray("blogPosts")}
					/>
				</div>
				<div className="container-something">
					<button
						className="fa fa-plus fa-2x add-new"
						onClick={() => this.addNewIndexToWritersBriefArray("emailNewsletters")}
					/>
				</div>
			</div>
		);
	}
}

export default WritersBriefForm;
