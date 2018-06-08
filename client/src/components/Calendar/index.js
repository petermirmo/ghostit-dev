import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

import { connect } from "react-redux";

import ContentModal from "../../pages/ContentPage/PostingFiles/ContentModal";
import PostEdittingModal from "../../pages/ContentPage/PostingFiles/PostEdittingModal";
import BlogEdittingModal from "../../pages/ContentPage/PostingFiles/BlogEdittingModal";
import NewsletterEdittingModal from "../../pages/ContentPage/PostingFiles/NewsletterEdittingModal";
import NavigationBar from "../Navigations/NavigationBar/";
import NewCalendar from "./NewCalendar/";
import "./style.css";

class Content extends Component {
	state = {
		edittingPost: {},
		edittingImages: [],

		facebookPosts: [],
		twitterPosts: [],
		linkedinPosts: [],
		websitePosts: [],
		newsletterPosts: [],

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
	componentDidMount() {
		this._ismounted = true;
		axios.get("/api/timezone").then(res => {
			let { timezone, loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			if (!timezone) timezone = this.state.timezone;
			moment.tz.setDefault(timezone);

			if (this._ismounted) this.setState({ timezone: timezone });
		});

		this.getPosts();
		this.getBlogs();
		this.getNewsletters();
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
					facebookPosts.push(posts[index]);
				} else if (posts[index].socialType === "twitter") {
					twitterPosts.push(posts[index]);
				} else if (posts[index].socialType === "linkedin") {
					linkedinPosts.push(posts[index]);
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
				blogEvents.push(blogs[index]);
			}
			if (this._ismounted) {
				this.setState({ websitePosts: blogEvents });
			}
		});
	};

	getNewsletters = () => {
		axios.get("/api/newsletters").then(res => {
			let { newsletters, loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			let newsletterEvents = [];
			for (let index in newsletters) {
				newsletterEvents.push(newsletters[index]);
			}
			if (this._ismounted) {
				this.setState({ newsletterPosts: newsletterEvents });
			}
		});
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
		} else if (clickedCalendarEvent.socialType === "newsletter") {
			this.setState({ newsletterEdittingModal: true, clickedCalendarEvent: clickedCalendarEvent });
		} else {
			this.setState({ postEdittingModal: true, clickedCalendarEvent: clickedCalendarEvent });
		}
	};

	closeModals = () => {
		this.setState({
			blogEdittingModal: false,
			contentModal: false,
			postEdittingModal: false,
			newsletterEdittingModal: false
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

	render() {
		const {
			calendarEventCategories,
			facebookPosts,
			twitterPosts,
			linkedinPosts,
			instagramPosts,
			websitePosts,
			newsletterPosts,
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
			for (let index in newsletterPosts) {
				events.push(newsletterPosts[index]);
			}
		}
		return (
			<div id="wrapper">
				<NavigationBar categories={calendarEventCategories} updateParentState={this.updateTabState} />
				<NewCalendar
					events={events}
					calendarDate={new moment()}
					onSelectSlot={this.openModal}
					onSelectEvent={this.editPost}
				/>
				{this.state.contentModal && (
					<ContentModal
						clickedCalendarDate={this.state.clickedDate}
						timezone={timezone}
						close={this.closeModals}
						savePostCallback={() => {
							this.getPosts();
							this.closeModals();
						}}
						saveBlogCallback={() => {
							this.getBlogs();
							this.closeModals();
						}}
						saveNewsletterCallback={() => {
							this.getNewsletters();
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
				{this.state.newsletterEdittingModal && (
					<NewsletterEdittingModal
						updateCalendarNewsletters={this.getNewsletters}
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

export default connect(mapStateToProps)(Content);
