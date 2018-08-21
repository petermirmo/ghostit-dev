import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faPlusCircle from "@fortawesome/fontawesome-free-solid/faPlusCircle";
import Textarea from "react-textarea-autosize";
import moment from "moment-timezone";
import axios from "axios";

import NavigationBar from "../../components/Navigations/NavigationBar";
import CreateBlog from "../../components/CreateBlog/";
import CreateNewsletter from "../../components/CreateNewsletter/";
import Loader from "../../components/Notifications/Loader/";
import SearchColumn from "../../components/SearchColumn/";
import DateTimePicker from "../../components/DateTimePicker/";

class WritersBriefForm extends Component {
	state = {
		writersBrief: this.props.writersBrief,
		socialCategories: { facebook: true, instagram: false, twitter: false, linkedin: false },
		blogs: [],
		newsletters: [],
		notification: {
			on: false,
			title: "",
			message: "",
			type: "danger"
		},
		clickedBlogIndex: undefined,
		clickedNewsletterIndex: undefined,
		saving: false
	};
	componentDidMount() {
		this.getNewslettersInBrief();
		this.getBlogsInBrief();
		this._ismounted = true;
	}
	componentWillUnmount() {
		this._ismounted = false;
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.writersBrief) {
			this.setState({ writersBrief: nextProps.writersBrief, blogs: [], clickedBlogIndex: undefined });
		}
	}

	getBlogsInBrief = () => {
		let { writersBrief } = this.state;
		axios
			.post("/api/blogsInBriefs", {
				cycleStartDate: writersBrief.cycleStartDate,
				cycleEndDate: writersBrief.cycleEndDate
			})
			.then(res => {
				let { blogs, success, errorMessage } = res.data;
				blogs.sort(compare);
				if (success) {
					if (this._ismounted) {
						this.setState({ blogs: blogs });
					}
				} else {
					this.notify({ type: "danger", message: errorMessage, title: "Error" });
				}
			});
	};

	getNewslettersInBrief = () => {
		let { writersBrief } = this.state;
		axios
			.post("/api/newslettersInBriefs", {
				cycleStartDate: writersBrief.cycleStartDate,
				cycleEndDate: writersBrief.cycleEndDate
			})
			.then(res => {
				let { newsletters, success, errorMessage } = res.data;

				newsletters.sort(compare);
				if (success) {
					if (this._ismounted) {
						this.setState({ newsletters: newsletters });
					}
				} else {
					this.notify({ type: "danger", message: errorMessage, title: "Error" });
				}
			});
	};
	blogPostClicked = event => {
		let clickedBlogIndex = event.target.id;
		this.setState({ clickedBlogIndex: clickedBlogIndex });
	};
	newsletterPostClicked = event => {
		let clickedNewsletterIndex = event.target.id;
		this.setState({ clickedNewsletterIndex: clickedNewsletterIndex });
	};

	saveWritersBrief = () => {
		this.setState({ saving: true });

		let { writersBrief } = this.state;
		axios.post("/api/writersBrief", { writersBrief: writersBrief }).then(res => {
			if (this._ismounted) {
				this.setState({ saving: false });
			}
			let { success, errorMessage, loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

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
		this.getBlogsInBrief();
		this.getNewslettersInBrief();
	};
	newBlog = () => {
		this.setState({ clickedBlogIndex: undefined });
	};
	newNewsletter = () => {
		this.setState({ clickedNewsletterIndex: undefined });
	};
	updateBlogs = () => {
		this.getBlogsInBrief();
		this.setState({ saving: false });
	};
	updateNewsletters = () => {
		this.getNewslettersInBrief();
		this.setState({ saving: false });
	};
	render() {
		let {
			writersBrief,
			socialCategories,
			saving,
			blogs,
			clickedBlogIndex,
			newsletters,
			clickedNewsletterIndex
		} = this.state;
		let { cycleStartDate, cycleEndDate, socialPostsDescriptions } = writersBrief;

		let activeTab;
		for (let index in socialCategories) {
			if (socialCategories[index]) activeTab = index;
		}

		let activeBlog;
		if (blogs[clickedBlogIndex]) activeBlog = blogs[clickedBlogIndex];

		let activeNewsletter;
		if (newsletters[clickedNewsletterIndex]) activeNewsletter = newsletters[clickedNewsletterIndex];

		return (
			<div className="writers-brief-form center">
				<div className="container-placeholder center">
					<p className="date-label">Content cycle start: </p>

					<DateTimePicker
						date={cycleStartDate}
						dateFormat="MMMM Do YYYY"
						handleChange={date => this.handleDateChange(date, "cycleStartDate")}
						dateLowerBound={new moment()}
					/>

					<p className="date-label">Content cycle end: </p>

					<DateTimePicker
						date={cycleEndDate}
						dateFormat="MMMM Do YYYY"
						handleChange={date => this.handleDateChange(date, "cycleEndDate")}
						dateLowerBound={new moment()}
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

				<div className="container-placeholder center">
					<SearchColumn objectList={blogs} handleClickedObject={this.blogPostClicked} />
					<FontAwesomeIcon icon={faPlusCircle} size="3x" className="add-new" onClick={() => this.newBlog()} />
					<CreateBlog
						blog={activeBlog}
						callback={this.updateBlogs}
						setSaving={this.setSaving}
						postingDate={new moment()}
					/>
				</div>

				<div className="container-placeholder center">
					<SearchColumn objectList={newsletters} handleClickedObject={this.newsletterPostClicked} />
					<FontAwesomeIcon icon={faPlusCircle} size="3x" className="add-new" onClick={() => this.newNewsletter()} />
					<CreateNewsletter
						newsletter={activeNewsletter}
						callback={this.updateNewsletters}
						setSaving={this.setSaving}
						postingDate={new moment()}
					/>
				</div>
				{saving && <Loader />}
			</div>
		);
	}
}

function compare(a, b) {
	if (a.title < b.title) return -1;
	if (a.title > b.title) return 1;
	return 0;
}

export default WritersBriefForm;
