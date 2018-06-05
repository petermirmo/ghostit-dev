import React, { Component } from "react";
import axios from "axios";
import BigCalendar from "react-big-calendar";
import moment from "moment";

import { connect } from "react-redux";

import ContentModal from "../PostingFiles/ContentModal";
import PostEdittingModal from "../PostingFiles/PostEdittingModal";
import BlogEdittingModal from "../PostingFiles/BlogEdittingModal";
import NavigationBar from "../../../components/Navigations/NavigationBar/";
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
		},
		timezone: "America/Vancouver"
	};
	constructor(props) {
		super(props);
		BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
	}
	componentDidMount() {
		this._ismounted = true;
		axios.get("/api/timezone").then(res => {
			let { timezone, loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			if (!timezone) timezone = "America/Vancouver";

			moment.tz.setDefault(timezone);

			this.setState({ timezone: timezone });
		});

		this.getPosts();
		this.getBlogs();
	}

	componentWillUnmount() {
		this._ismounted = false;
	}

	getPosts = () => {
		let facebookPosts = [];
		let twitterPosts = [];
		let linkedinPosts = [];

		// Get all of user's posts to display in calendar
		axios.get("/api/posts").then(res => {
			// Set posts to state
			let { posts, loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			for (let index in posts) {
				if (posts[index].socialType === "facebook") {
					facebookPosts.push(this.convertPostToCalendarEvent(posts[index]));
				} else if (posts[index].socialType === "twitter") {
					twitterPosts.push(this.convertPostToCalendarEvent(posts[index]));
				} else if (posts[index].socialType === "linkedin") {
					linkedinPosts.push(this.convertPostToCalendarEvent(posts[index]));
				}
			}
			if (this._ismounted) {
				this.setState({
					facebookPosts: facebookPosts,
					twitterPosts: twitterPosts,
					linkedinPosts: linkedinPosts
				});
			}
		});
	};

	getBlogs = () => {
		axios.get("/api/blogs").then(res => {
			let { blogs, loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			let blogEvents = [];
			for (let index in blogs) {
				blogEvents.push(this.convertBlogToCalendarEvent(blogs[index]));
			}
			if (this._ismounted) {
				this.setState({ websitePosts: blogEvents });
			}
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
	closeModals = () => {
		this.setState({
			blogEdittingModal: false,
			contentModal: false,
			postEdittingModal: false
		});
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
	savePostCallback = () => {
		this.getPosts();
	};
	saveBlogCallback = () => {
		this.getBlogs();
	};
	render() {
		const {
			calendarEventCategories,
			facebookPosts,
			twitterPosts,
			linkedinPosts,
			instagramPosts,
			websitePosts,
			emailNewsletterPosts,
			timezone
		} = this.state;
		const { All, Facebook, Twitter, Linkedin, Instagram, Blog, Newsletter } = calendarEventCategories;

		let events = [];

		if (Facebook || All) {
			for (let index in facebookPosts) {
				events.push(facebookPosts[index]);
			}
		}
		if (Twitter || All) {
			for (let index in twitterPosts) {
				events.push(twitterPosts[index]);
			}
		}
		if (Linkedin || All) {
			for (let index in linkedinPosts) {
				events.push(linkedinPosts[index]);
			}
		}
		if (Instagram || All) {
			for (let index in instagramPosts) {
				events.push(instagramPosts[index]);
			}
		}
		if (Blog || All) {
			for (let index in websitePosts) {
				events.push(websitePosts[index]);
			}
		}
		if (Newsletter || All) {
			for (let index in emailNewsletterPosts) {
				events.push(emailNewsletterPosts[index]);
			}
		}

		return (
			<div>
				<NavigationBar categories={calendarEventCategories} updateParentState={this.updateTabState} />
				<BigCalendar
					selectable
					{...this.props}
					events={events}
					defaultDate={new Date()}
					onSelectSlot={this.openModal}
					onSelectEvent={this.editPost}
					eventPropGetter={this.eventStyleGetter}
				/>
				{this.state.contentModal && (
					<ContentModal
						clickedCalendarDate={this.state.clickedDate}
						timezone={timezone}
						close={this.closeModals}
						savePostCallback={() => {
							this.savePostCallback();
							this.closeModals();
						}}
						saveBlogCallback={() => {
							this.saveBlogCallback();
							this.closeModals();
						}}
					/>
				)}
				{this.state.postEdittingModal && (
					<PostEdittingModal
						savePostCallback={this.savePostCallback}
						clickedCalendarEvent={this.state.clickedCalendarEvent}
						timezone={timezone}
						close={this.closeModals}
					/>
				)}
				{this.state.blogEdittingModal && (
					<BlogEdittingModal
						updateCalendarBlogs={this.getBlogs}
						clickedCalendarEvent={this.state.clickedCalendarEvent}
						close={this.closeModals}
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
