import React, { Component } from "react";
import axios from "axios";

import "../css/theme.css";
import ContentModal from "../components/modals/ContentModalComponent";
import EdittingModal from "../components/modals/EdittingModalComponent";

// BigCalendar dependencies
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "../css/calendar.css";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);
var clickedCalendarDate = new Date();
var timeForPost = new Date();

class Calendar extends Component {
	state = {
		posts: [],
		edittingPost: {},
		edittingImages: [],
		facebookPosts: [],
		twitterPosts: [],
		linkedinPosts: [],
		websitePosts: [],
		emailNewsletterPosts: []
	};
	constructor(props) {
		super(props);
		this.getPosts = this.getPosts.bind(this);
		this.editPost = this.editPost.bind(this);
		this.setPostsToState = this.setPostsToState.bind(this);

		this.getPosts();
	}
	getPosts() {
		this.state.facebookPosts = [];
		this.state.twitterPosts = [];
		this.state.linkedinPosts = [];
		this.state.websitePosts = [];
		this.state.emailNewsletterPosts = [];
		// Get all of user's posts to display in calendar
		axios.get("/api/posts").then(res => {
			// Set posts to state
			var postArray = res.data;
			for (var index in postArray) {
				if (postArray[index].socialType === "facebook") {
					this.state.facebookPosts.push(postArray[index]);
				} else if (postArray[index].socialType === "twitter") {
					this.state.twitterPosts.push(postArray[index]);
				} else if (postArray[index].socialType === "linkedin") {
					this.state.linkedinPosts.push(postArray[index]);
				} else if (postArray[index].socialType === "website") {
					this.state.websitePosts.push(postArray[index]);
				} else if (postArray[index].socialType === "newsletter") {
					this.state.emailNewsletterPosts.push(postArray[index]);
				}
			}
			this.setPostsToState(postArray);
		});
	}
	setPostsToState(postsToShowArray) {
		var eventsArray = [];
		var event = {};
		for (var index = 0; index < postsToShowArray.length; index++) {
			event = postsToShowArray[index];
			event.start = postsToShowArray[index].postingDate;
			event.end = postsToShowArray[index].postingDate;
			event.link = postsToShowArray[index].link;
			event.linkImage = postsToShowArray[index].linkImage;
			event.accountType = postsToShowArray[index].accountType;
			event.socialType = postsToShowArray[index].socialType;
			event.backgroundColor = postsToShowArray[index].color;
			if (postsToShowArray[index].content === "") {
				event.title = "(no content)";
			} else {
				event.title = postsToShowArray[index].content;
			}

			eventsArray.push(event);
		}
		this.setState({ posts: eventsArray });
	}
	openModal(slotinfo) {
		// Date for post is set to date clicked on calendar
		clickedCalendarDate = slotinfo.start;
		this.setState({ clickedCalendarDate: clickedCalendarDate });

		// Time for post is set to current time
		this.setState({ timeForPost: timeForPost });

		// Open modal
		document.getElementById("postingModal").style.display = "block";
	}
	editPost(clickedCalendarEvent) {
		// Open editting modal
		document.getElementById("edittingModal").style.display = "block";
		this.refs.refEditModal.initialize(clickedCalendarEvent);
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
				<ContentModal
					clickedCalendarDate={clickedCalendarDate}
					timeForPost={timeForPost}
					updateCalendarPosts={this.getPosts}
				/>
				<EdittingModal post={this.state.edittingPost} ref="refEditModal" updateCalendarPosts={this.getPosts} />
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
