import React, { Component } from "react";
import axios from "axios";

import ContentModal from "./ContentModalComponent";
import EdittingModal from "./EdittingModalComponent";
import BlogEdittingModal from "./BlogEdittingModalComponent";

// BigCalendar dependencies
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "./calendar.css";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class Calendar extends Component {
	state = {
		posts: [],
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
		postEdittingModal: false
	};
	constructor(props) {
		super(props);
		this.getPosts = this.getPosts.bind(this);
		this.getBlogs = this.getBlogs.bind(this);
		this.editPost = this.editPost.bind(this);
		this.convertPostToCalendarEvent = this.convertPostToCalendarEvent.bind(this);

		this.getPosts();
		this.getBlogs();
	}
	getBlogs() {
		axios.get("/api/blogs").then(res => {
			var blogs = res.data;
			var blogEvents = [];
			for (var index in blogs) {
				blogEvents.push(this.convertBlogToCalendarEvent(blogs[index]));
			}
			this.setState({ websitePosts: blogEvents, blogEdittingModal: false, contentModal: false });
		});
	}
	convertBlogToCalendarEvent(blog) {
		var calendarEvent = blog;

		var date = new Date(blog.postingDate);
		calendarEvent.start = date;
		calendarEvent.end = date;
		calendarEvent.socialType = "blog";
		calendarEvent.backgroundColor = blog.eventColor;
		calendarEvent.title = blog.title || "(no title)";

		return calendarEvent;
	}
	getPosts() {
		var facebookPosts = [];
		var twitterPosts = [];
		var linkedinPosts = [];

		// Get all of user's posts to display in calendar
		axios.get("/api/posts").then(res => {
			// Set posts to state
			var posts = res.data;
			for (var index in posts) {
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
	}

	convertPostToCalendarEvent(post) {
		var calendarEvent = {};

		var date = new Date(post.postingDate);
		calendarEvent = post;
		calendarEvent.start = date;
		calendarEvent.end = date;
		calendarEvent.link = post.link;
		calendarEvent.linkImage = post.linkImage;
		calendarEvent.accountType = post.accountType;
		calendarEvent.socialType = post.socialType;
		calendarEvent.backgroundColor = post.color;
		if (post.content === "") {
			calendarEvent.title = "(no content)";
		} else {
			calendarEvent.title = post.content;
		}
		return calendarEvent;
	}
	openModal(slotinfo) {
		// Date for post is set to date clicked on calendar
		// Time for post is set to current time
		this.setState({ clickedDate: slotinfo.start, contentModal: true });
	}
	editPost(clickedCalendarEvent) {
		// Open editting modal
		if (clickedCalendarEvent.socialType === "blog") {
			this.setState({ blogEdittingModal: true, clickedCalendarEvent: clickedCalendarEvent });
		} else {
			this.setState({ postEdittingModal: true, clickedCalendarEvent: clickedCalendarEvent });
		}
	}
	eventStyleGetter(event, start, end, isSelected) {
		var backgroundColor = event.backgroundColor;
		var style = {
			backgroundColor: backgroundColor
		};
		return {
			style: style
		};
	}
	closeModal = modal => {
		this.setState({ [modal]: false });
	};
	render() {
		var events = [];
		if (facebookNavBarGlobal || allNavBarGlobal) {
			for (var index in this.state.facebookPosts) {
				events.push(this.state.facebookPosts[index]);
			}
		}
		if (twitterNavBarGlobal || allNavBarGlobal) {
			for (index in this.state.twitterPosts) {
				events.push(this.state.twitterPosts[index]);
			}
		}
		if (linkedinNavBarGlobal || allNavBarGlobal) {
			for (index in this.state.linkedinPosts) {
				events.push(this.state.linkedinPosts[index]);
			}
		}
		if (blogNavBarGlobal || allNavBarGlobal) {
			for (index in this.state.websitePosts) {
				events.push(this.state.websitePosts[index]);
			}
		}
		if (emailNavBarGlobal || allNavBarGlobal) {
			for (index in this.state.emailNewsletterPosts) {
				events.push(this.state.emailNewsletterPosts[index]);
			}
		}

		// Calendar stuff
		var calendar = (
			<BigCalendar
				selectable
				{...this.props}
				events={events}
				defaultDate={new Date()}
				onSelectSlot={slotInfo => this.openModal(slotInfo)}
				onSelectEvent={clickedCalendarEvent => this.editPost(clickedCalendarEvent)}
				eventPropGetter={this.eventStyleGetter}
			/>
		);
		return (
			<div>
				{this.state.contentModal && (
					<ContentModal
						clickedCalendarDate={this.state.clickedDate}
						timeForPost={new Date()}
						updateCalendarPosts={this.getPosts}
						usersTimezone={this.props.usersTimezone}
						updateCalendarBlogs={this.getBlogs}
						close={this.closeModal}
					/>
				)}
				{this.state.postEdittingModal && (
					<EdittingModal
						updateCalendarPosts={this.getPosts}
						clickedCalendarEvent={this.state.clickedCalendarEvent}
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
				<ul>
					<li
						onClick={() => {
							navBar("All");
							this.forceUpdate();
						}}
					>
						<a id="calendarNavBarAll" className="active">
							All
						</a>
					</li>
					<li
						onClick={() => {
							navBar("Facebook");
							this.forceUpdate();
						}}
					>
						<a id="calendarNavBarFacebook">Facebook</a>
					</li>
					<li
						onClick={() => {
							navBar("Twitter");
							this.forceUpdate();
						}}
					>
						<a id="calendarNavBarTwitter">Twitter</a>
					</li>
					<li
						onClick={() => {
							navBar("Linkedin");
							this.forceUpdate();
						}}
					>
						<a id="calendarNavBarLinkedin">Linkedin</a>
					</li>
					<li
						onClick={() => {
							navBar("WebsiteBlog");
							this.forceUpdate();
						}}
					>
						<a id="calendarNavBarWebsiteBlog">Website Blogs</a>
					</li>
					<li
						onClick={() => {
							navBar("EmailNewsletter");
							this.forceUpdate();
						}}
					>
						<a id="calendarNavBarEmailNewsletter">Email Newsletter</a>
					</li>
				</ul>

				{calendar}
			</div>
		);
	}
}

// Content page navbar logic

// Calendar navbar variables
var allNavBarGlobal = true;
var facebookNavBarGlobal = false;
var twitterNavBarGlobal = false;
var linkedinNavBarGlobal = false;
var blogNavBarGlobal = false;
var emailNavBarGlobal = false;

function navBar(navBarClickedSocialMedia) {
	var allNavBar = document.getElementById("calendarNavBarAll");
	var facebookNavBar = document.getElementById("calendarNavBarFacebook");
	var twitterNavBar = document.getElementById("calendarNavBarTwitter");
	var linkedinNavBar = document.getElementById("calendarNavBarLinkedin");
	var blogNavBar = document.getElementById("calendarNavBarWebsiteBlog");
	var emailNavBar = document.getElementById("calendarNavBarEmailNewsletter");

	if (navBarClickedSocialMedia === "All") {
		if (allNavBarGlobal) {
			//if "All" content is on, turn it off
			allNavBar.classList.remove("active");
			allNavBarGlobal = false;
		} else {
			//turn all tabs off
			facebookNavBar.classList.remove("active");
			twitterNavBar.classList.remove("active");
			linkedinNavBar.classList.remove("active");
			blogNavBar.classList.remove("active");
			emailNavBar.classList.remove("active");
			facebookNavBarGlobal = false;
			twitterNavBarGlobal = false;
			linkedinNavBarGlobal = false;
			blogNavBarGlobal = false;
			emailNavBarGlobal = false;

			//turn "All" content on
			allNavBar.className += "active";
			allNavBarGlobal = true;
		}
	} else if (navBarClickedSocialMedia === "Facebook") {
		if (facebookNavBarGlobal) {
			facebookNavBar.classList.remove("active");
			facebookNavBarGlobal = false;
		} else {
			allNavBar.classList.remove("active");
			allNavBarGlobal = false;

			facebookNavBar.className += "active";
			facebookNavBarGlobal = true;
		}
		//if its already on turn it off
	} else if (navBarClickedSocialMedia === "Twitter") {
		if (twitterNavBarGlobal) {
			twitterNavBar.classList.remove("active");
			twitterNavBarGlobal = false;
		} else {
			allNavBar.classList.remove("active");
			allNavBarGlobal = false;

			twitterNavBar.className += "active";
			twitterNavBarGlobal = true;
		}
	} else if (navBarClickedSocialMedia === "Linkedin") {
		if (linkedinNavBarGlobal) {
			linkedinNavBar.classList.remove("active");
			linkedinNavBarGlobal = false;
		} else {
			allNavBar.classList.remove("active");
			allNavBarGlobal = false;

			linkedinNavBar.className += "active";
			linkedinNavBarGlobal = true;
		}
	} else if (navBarClickedSocialMedia === "WebsiteBlog") {
		if (blogNavBarGlobal) {
			blogNavBar.classList.remove("active");
			blogNavBarGlobal = false;
		} else {
			allNavBar.classList.remove("active");
			allNavBarGlobal = false;

			blogNavBar.className += "active";
			blogNavBarGlobal = true;
		}
	} else if (navBarClickedSocialMedia === "EmailNewsletter") {
		if (emailNavBarGlobal) {
			emailNavBar.classList.remove("active");
			emailNavBarGlobal = false;
		} else {
			allNavBar.classList.remove("active");
			allNavBarGlobal = false;

			emailNavBar.className += "active";
			emailNavBarGlobal = true;
		}
	}

	return;
}
export default Calendar;
