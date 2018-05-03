import React, { Component } from "react";
import axios from "axios";
import BigCalendar from "react-big-calendar";
import moment from "moment";

import { connect } from "react-redux";

import ContentModal from "../Modals/ContentModal";
import PostEdittingModal from "../Modals/PostEdittingModal";
import BlogEdittingModal from "../Modals/BlogEdittingModal";
import Navigation from "../../../components/NavigationBar/";
import "./style.css";

Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class Calendar extends Component {
	state = {
		edittingPost: {},
		edittingImages: [],

		facebookPosts: [],
		twitterPosts: [],
		linkedinPosts: [],
		websitePosts: [],
		emailNewsletterPosts: [],

		clickedDate: new Date(),

		blogEdittingModal: false,
		contentModal: false,
		postEdittingModal: false,

		calendarEventCategories: {
			All: true,
			Facebook: false,
			Twitter: false,
			Linkedin: false,
			Blog: false
		}
	};
	constructor(props) {
		super(props);

		moment.tz.setDefault(props.user.timezone);
		BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

		this.getPosts();
		this.getBlogs();
	}

	getBlogs = () => {
		axios.get("/api/blogs").then(res => {
			let blogs = res.data;
			let blogEvents = [];
			for (let index in blogs) {
				blogEvents.push(this.convertBlogToCalendarEvent(blogs[index]));
			}
			this.setState({ websitePosts: blogEvents, blogEdittingModal: false, contentModal: false });
		});
	};
	convertBlogToCalendarEvent = blog => {
		let date = new Date(blog.postingDate);

		let calendarEvent = blog;
		calendarEvent.start = date;
		calendarEvent.end = date;
		calendarEvent.socialType = "blog";
		calendarEvent.backgroundColor = blog.eventColor;
		calendarEvent.title = blog.title || "(no title)";

		return calendarEvent;
	};
	getPosts = () => {
		let facebookPosts = [];
		let twitterPosts = [];
		let linkedinPosts = [];

		// Get all of user's posts to display in calendar
		axios.get("/api/posts").then(res => {
			// Set posts to state
			let posts = res.data;
			for (let index in posts) {
				if (posts[index].socialType === "facebook") {
					facebookPosts.push(this.convertPostToCalendarEvent(posts[index]));
				} else if (posts[index].socialType === "twitter") {
					twitterPosts.push(this.convertPostToCalendarEvent(posts[index]));
				} else if (posts[index].socialType === "linkedin") {
					linkedinPosts.push(this.convertPostToCalendarEvent(posts[index]));
				}
			}
			this.setState({
				facebookPosts: facebookPosts,
				twitterPosts: twitterPosts,
				linkedinPosts: linkedinPosts,
				postEdittingModal: false,
				contentModal: false
			});
		});
	};

	convertPostToCalendarEvent = post => {
		let date = new Date(post.postingDate);

		let calendarEvent = post;
		calendarEvent.start = date;
		calendarEvent.end = date;
		calendarEvent.backgroundColor = post.color;
		if (post.content === "") {
			calendarEvent.title = "(no content)";
		} else {
			calendarEvent.title = post.content;
		}
		return calendarEvent;
	};
	openModal = slotinfo => {
		// Date for post is set to date clicked on calendar
		// Time for post is set to current time
		this.setState({ clickedDate: slotinfo.start, contentModal: true });
	};
	editPost = clickedCalendarEvent => {
		// Open editting modal
		if (clickedCalendarEvent.socialType === "blog") {
			this.setState({ blogEdittingModal: true, clickedCalendarEvent: clickedCalendarEvent });
		} else {
			this.setState({ postEdittingModal: true, clickedCalendarEvent: clickedCalendarEvent });
		}
	};
	eventStyleGetter = (event, start, end, isSelected) => {
		let backgroundColor = event.backgroundColor;
		let style = {
			backgroundColor: backgroundColor
		};
		return {
			style: style
		};
	};
	closeModal = modal => {
		this.setState({ [modal]: false });
	};
	updateTabState = event => {
		// Category name is stored in html element id
		let categoryName = event.target.id;
		let calendarEventCategories = this.state.calendarEventCategories;
		calendarEventCategories[categoryName] = !calendarEventCategories[categoryName];
		calendarEventCategories["All"] = false;

		if (categoryName === "All") {
			this.setState({
				calendarEventCategories: {
					All: true,
					Facebook: false,
					Twitter: false,
					Linkedin: false,
					Blog: false
				}
			});
		} else {
			this.setState({ calendarEventCategories: calendarEventCategories });
		}
	};
	render() {
		const { calendarEventCategories } = this.state;
		const { allActive } = calendarEventCategories;
		let events = [];

		if (this.state.facebookActive || allActive) {
			for (let index in this.state.facebookPosts) {
				events.push(this.state.facebookPosts[index]);
			}
		}
		if (this.state.twitterActive || allActive) {
			for (let index in this.state.twitterPosts) {
				events.push(this.state.twitterPosts[index]);
			}
		}
		if (this.state.linkedinActive || allActive) {
			for (let index in this.state.linkedinPosts) {
				events.push(this.state.linkedinPosts[index]);
			}
		}
		if (this.state.instagramActive || allActive) {
			for (let index in this.state.instagramPosts) {
				events.push(this.state.instagramPosts[index]);
			}
		}
		if (this.state.blogActive || allActive) {
			for (let index in this.state.websitePosts) {
				events.push(this.state.websitePosts[index]);
			}
		}
		if (this.state.newsletterActive || allActive) {
			for (let index in this.state.emailNewsletterPosts) {
				events.push(this.state.emailNewsletterPosts[index]);
			}
		}

		return (
			<div>
				<Navigation categories={calendarEventCategories} updateParentState={this.updateTabState} />
				<BigCalendar
					selectable
					{...this.props}
					events={events}
					defaultDate={new Date()}
					onSelectSlot={slotInfo => this.openModal(slotInfo)}
					onSelectEvent={clickedCalendarEvent => this.editPost(clickedCalendarEvent)}
					eventPropGetter={this.eventStyleGetter}
				/>
				{this.state.contentModal && (
					<ContentModal
						clickedCalendarDate={this.state.clickedDate}
						updateCalendarPosts={this.getPosts}
						usersTimezone={this.props.usersTimezone}
						updateCalendarBlogs={this.getBlogs}
						close={this.closeModal}
					/>
				)}
				{this.state.postEdittingModal && (
					<PostEdittingModal
						updateCalendarPosts={this.getPosts}
						clickedCalendarEvent={this.state.clickedCalendarEvent}
						usersTimezone={this.props.usersTimezone}
						close={this.closeModal}
					/>
				)}
				{this.state.blogEdittingModal && (
					<BlogEdittingModal
						updateCalendarBlogs={this.getBlogs}
						clickedCalendarEvent={this.state.clickedCalendarEvent}
						close={this.closeModal}
					/>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default connect(mapStateToProps)(Calendar);
