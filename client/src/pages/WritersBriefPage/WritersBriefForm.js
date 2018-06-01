import React, { Component } from "react";
import axios from "axios";
import Textarea from "react-textarea-autosize";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import NavigationBar from "../../components/Navigations/NavigationBar";
import CreateBlog from "../ContentPage/PostingFiles/CreateBlog/";
import Loader from "../../components/Notifications/Loader/";
import SearchColumn from "../../components/SearchColumn/";

class WritersBriefForm extends Component {
	state = {
		writersBrief: this.props.writersBrief,
		socialCategories: { facebook: true, instagram: false, twitter: false, linkedin: false },
		blogPosts: [],
		notification: {
			on: false,
			title: "",
			message: "",
			type: "danger"
		},
		saving: false
	};
	componentDidMount() {
		//this.getBlogsInBrief();
		this._ismounted = true;
	}
	componentWillUnmount() {
		this._ismounted = false;
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ writersBrief: nextProps.writersBrief });
	}

	getBlogsInBrief = () => {
		axios.get("/api/blogsInBriefs").then(res => {
			let { blogs } = res.data;

			if (this._ismounted) {
				this.setState({ websitePosts: blogs });
			}
		});
	};
	blogPostClicked = () => {};

	saveWritersBrief = () => {
		this.setState({ saving: true });
		let { writersBrief } = this.state;
		axios.post("/api/writersBrief", { writersBrief: writersBrief }).then(res => {
			if (this._ismounted) {
				this.setState({ saving: false });
			}
			let { success, errorMessage } = res.data;
			if (!success) {
				this.notify({ type: "danger", message: errorMessage, title: "error :(" });
			}
		});
	};

	updateSocialPostsActiveTab = event => {
		// Remove active class from last tab
		let { socialCategories } = this.state;
		for (let index in socialCategories) {
			socialCategories[index] = false;
		}
		socialCategories[event.target.id] = true;
		this.setState({ socialCategories: socialCategories });
	};

	setSaving = () => {
		this.setState({ saving: true });
	};
	notify = notificationObject => {
		const { title, message, type } = notificationObject;

		let { notification } = this.state;
		notification.on = !notification.on;

		if (title) notification.title = title;
		if (message) notification.message = message;
		if (type) notification.type = type;

		this.setState({ notification: notification });

		if (notification.on) {
			setTimeout(() => {
				let { notification } = this.state;
				notification.on = false;
				this.setState({ notification: notification });
			}, 1500);
		}
	};

	handleChangeSocialDescription = (value, index) => {
		let { writersBrief } = this.state;
		writersBrief["socialPostsDescriptions"][index] = value;
		this.setState({ writersBrief: writersBrief });
		this.props.updateWritersBrief(writersBrief);
	};

	handleDateChange = (date, index) => {
		let { writersBrief } = this.state;
		writersBrief[index] = date;
		this.setState({ writersBrief: writersBrief });
		this.props.updateWritersBrief(writersBrief);
	};
	render() {
		let { writersBrief, socialCategories, saving } = this.state;
		let { cycleStartDate, cycleEndDate, socialPostsDescriptions } = writersBrief;

		let activeTab;
		for (let index in socialCategories) {
			if (socialCategories[index]) activeTab = index;
		}
		return (
			<div className="writers-brief-form center">
				<div className="container-placeholder">
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

					<NavigationBar updateParentState={this.updateSocialPostsActiveTab} categories={socialCategories} />
					<p>Social Media Notes and Instructions ({activeTab}):</p>
					<Textarea
						className="textarea-social"
						placeholder="- funny and upbeat &#10;- 15 posts per month"
						value={socialPostsDescriptions[activeTab]}
						onChange={event => this.handleChangeSocialDescription(event.target.value, activeTab)}
					/>
					<button className="bright-save-button" onClick={() => this.saveWritersBrief()}>
						Save Writer's Brief
					</button>
				</div>

				<div className="container-placeholder">
					<SearchColumn objectList={[]} searchObjects={this.searchUsers} handleClickedObject={this.blogPostClicked} />

					<button
						className="fa fa-plus fa-2x add-new"
						onClick={() => this.addNewIndexToWritersBriefArray("blogPosts")}
					/>

					<CreateBlog blog={this.props.clickedCalendarEvent} callback={() => {}} setSaving={this.setSaving} />
				</div>
				<div className="container-placeholder">
					<SearchColumn
						objectList={[]}
						searchObjects={this.searchUsers}
						handleClickedObject={this.emailNewsletterClicked}
					/>

					<button
						className="fa fa-plus fa-2x add-new"
						onClick={() => this.addNewIndexToWritersBriefArray("emailNewsletters")}
					/>
				</div>
				{saving && <Loader />}
			</div>
		);
	}
}

export default WritersBriefForm;
