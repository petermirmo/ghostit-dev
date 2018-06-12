import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import { connect } from "react-redux";

import ContentModal from "./PostingFiles/ContentModal";
import PostEdittingModal from "./PostingFiles/PostEdittingModal";
import BlogEdittingModal from "./PostingFiles/BlogEdittingModal";
import NewsletterEdittingModal from "./PostingFiles/NewsletterEdittingModal";
import NavigationBar from "../../components/Navigations/NavigationBar/";
import NewCalendar from "../../components/Calendar/";
import "./style.css";

class Content extends Component {
	state = {
		clickedPost: {},

		facebookPosts: [],
		twitterPosts: [],
		linkedinPosts: [],
		websitePosts: [],
		newsletterPosts: [],

		clickedDate: new Date(),

		blogEdittingModal: false,
		contentModal: false,
		postEdittingModal: false,
		newsletterEdittingModal: false,

		calendarEventCategories: {
			All: true,
			Facebook: false,
			Twitter: false,
			Linkedin: false,
			Blog: false
		},
		timezone: ""
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

			if (this._ismounted) {
				this.setState({ websitePosts: blogs });
			}
		});
	};

	getNewsletters = () => {
		axios.get("/api/newsletters").then(res => {
			let { newsletters, loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			if (this._ismounted) {
				this.setState({ newsletterPosts: newsletters });
			}
		});
	};

	openModal = date => {
		// Date for post is set to date clicked on calendar
		// Time for post is set to current time
		this.setState({ clickedDate: date, contentModal: true });
	};
	editPost = post => {
		// Open editting modal
		if (post.socialType === "blog") {
			this.setState({ blogEdittingModal: true, clickedPost: post });
		} else if (post.socialType === "newsletter") {
			this.setState({ newsletterEdittingModal: true, clickedPost: post });
		} else {
			this.setState({ postEdittingModal: true, clickedPost: post });
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
			timezone,
			clickedPost,
			clickedDate
		} = this.state;
		const { All, Facebook, Twitter, Linkedin, Instagram, Blog, Newsletter } = calendarEventCategories;

		let postsToDisplay = [];

		if (Facebook || All) {
			for (let index in facebookPosts) {
				postsToDisplay.push(facebookPosts[index]);
			}
		}
		if (Twitter || All) {
			for (let index in twitterPosts) {
				postsToDisplay.push(twitterPosts[index]);
			}
		}
		if (Linkedin || All) {
			for (let index in linkedinPosts) {
				postsToDisplay.push(linkedinPosts[index]);
			}
		}
		if (Instagram || All) {
			for (let index in instagramPosts) {
				postsToDisplay.push(instagramPosts[index]);
			}
		}
		if (Blog || All) {
			for (let index in websitePosts) {
				postsToDisplay.push(websitePosts[index]);
			}
		}
		if (Newsletter || All) {
			for (let index in newsletterPosts) {
				postsToDisplay.push(newsletterPosts[index]);
			}
		}
		return (
			<div className="wrapper" style={this.props.margin}>
				<NavigationBar categories={calendarEventCategories} updateParentState={this.updateTabState} />
				<NewCalendar
					postsToDisplay={postsToDisplay}
					calendarDate={new moment()}
					onSelectDay={this.openModal}
					onSelectPost={this.editPost}
					timezone={timezone}
				/>
				{this.state.contentModal && (
					<ContentModal
						clickedCalendarDate={clickedDate}
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
						savePostCallback={() => this.getPosts()}
						clickedPost={clickedPost}
						timezone={timezone}
						close={this.closeModals}
					/>
				)}
				{this.state.blogEdittingModal && (
					<BlogEdittingModal updateCalendarBlogs={this.getBlogs} clickedPost={clickedPost} close={this.closeModals} />
				)}
				{this.state.newsletterEdittingModal && (
					<NewsletterEdittingModal
						updateCalendarNewsletters={this.getNewsletters}
						clickedPost={clickedPost}
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
