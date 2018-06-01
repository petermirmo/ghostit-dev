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
		saving: false
	};
	componentDidMount() {
		this.getBlogsInBrief();
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

	handleChangeSocialDescription = (value, index) => {
		let { writersBrief } = this.state;
		writersBrief["socialPostsDescriptions"][index] = value;
		this.setState({ writersBrief: writersBrief });
	};

	handleDateChange = (date, index) => {
		let { writersBrief } = this.state;
		writersBrief[index] = date;
		this.setState({ writersBrief: writersBrief });
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

	blogPostClicked = () => {};
	render() {
		let { writersBrief, socialCategories } = this.state;
		let { cycleStartDate, cycleEndDate, socialPostsDescriptions } = writersBrief;

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

				<NavigationBar updateParentState={this.updateSocialPostsActiveTab} categories={socialCategories} />
				<p>Social Media Notes and Instructions ({activeTab}):</p>
				<Textarea
					className="textarea-social"
					placeholder="- funny and upbeat &#10;- 15 facebook posts per month"
					value={socialPostsDescriptions[activeTab]}
					onChange={event => this.handleChangeSocialDescription(event.target.value, activeTab)}
				/>

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
			</div>
		);
	}
}

export default WritersBriefForm;
