import React, { Component } from "react";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import moment from "moment-timezone";

import DatePicker from "../Divs/DatePicker.js";
import TimePicker from "../Divs/TimePicker.js";
import Carousel from "../Carousel";
import CreateBlog from "./CreateBlog.js";
import SelectAccountDiv from "../Divs/SelectAccountDiv.js";
import ContentModalHeader from "./ContentModalHeader.js";
import ImagesDiv from "../Divs/ImagesDiv.js";
import {
	savePost,
	switchDateToUsersTimezoneInUtcForm,
	postChecks,
	convertDateAndTimeToUtcTme
} from "../../../functions/CommonFunctions";

import "../../../css/modal.css";

class Modal extends Component {
	state = {
		accounts: [],
		activeTab: "facebook",
		linkImagesArray: [],
		linkPreviewCanShow: "true",
		linkPreviewCanEdit: "false",
		postingToAccountId: "",
		link: "",
		postImages: [],
		accountType: "",
		contentValue: "",
		time: this.props.timeForPost,
		date: this.props.clickedCalendarDate,
		saving: false
	};
	constructor(props) {
		super(props);
		this.getUserAccounts();

		this.linkPreviewSetState = this.linkPreviewSetState.bind(this);
		this.postingAccountNav = this.postingAccountNav.bind(this);
		this.switchTabState = this.switchTabState.bind(this);
		this.clearActiveDivs = this.clearActiveDivs.bind(this);
		this.setPostImages = this.setPostImages.bind(this);
	}

	switchTabState(activeTab, canShow, canEdit) {
		this.setState({
			activeTab: activeTab,
			linkPreviewCanShow: canShow,
			linkPreviewCanEdit: canEdit,
			linkImagesArray: [],
			postingToAccountId: ""
		});
	}
	getUserAccounts() {
		// Get all connected accounts of the user
		axios.get("/api/accounts").then(res => {
			// Set user's accounts to state
			this.setState({ accounts: res.data });
		});
	}
	postingAccountNav(event) {
		var clickedAccount;
		// Make sure to get the actual div to set as active
		// Not just the h4 or something
		if (event.target.parentNode.classList.contains("connected-accounts-posting-div")) {
			clickedAccount = event.target.parentNode;
		} else {
			clickedAccount = event.target;
		}

		this.clearActiveDivs();
		// Add active class to clicked div
		clickedAccount.className += " common-active";

		// Set accountID and the accountType to state. children[1] is the <p>page</p> tag and the innerHTML is just the "page"
		this.setState({
			postingToAccountId: clickedAccount.id,
			accountType: clickedAccount.children[1].innerHTML
		});
	}
	clearActiveDivs() {
		this.setState({ postingToAccountId: "" });

		// Clear all divs to unactive
		var divArray = document.getElementsByClassName("connected-accounts-posting-div");
		for (var index in divArray) {
			if (divArray[index].classList) divArray[index].classList.remove("common-active");
		}
	}

	linkPreviewSetState(link, imagesArray) {
		this.setState({ link: link, linkImagesArray: imagesArray });
	}
	setPostImages(imagesArray) {
		this.setState({ postImages: imagesArray });
	}
	savePostCallback = () => {
		this.setState({
			linkImagesArray: [],
			link: "",
			postImages: []
		});
	};
	handleChange = (index, value) => {
		this.setState({
			[index]: value
		});
	};

	render() {
		if (this.state.saving) {
			return <div>here</div>;
		}
		const {
			activeTab,
			accounts,
			linkPreviewCanEdit,
			linkPreviewCanShow,
			date,
			time,
			saving,
			link,
			postImages,
			contentValue,
			postingToAccountId,
			accountType
		} = this.state;
		const { updateCalendarPosts, updateCalendarBlogs, usersTimezone, close } = this.props;

		var modalBody;
		var modalFooter;

		// Check if this is an email or blog placeholder
		if (activeTab !== "blog" && activeTab !== "newsletter") {
			// Loop through all accounts
			var activePageAccountsArray = [];
			for (var index in accounts) {
				// Check if the account is the same as active tab
				if (accounts[index].socialType === activeTab) {
					activePageAccountsArray.push(accounts[index]);
				}
			}
			// Accounts list
			var accountsListDiv = (
				<SelectAccountDiv
					postingAccountNav={this.postingAccountNav}
					activePageAccountsArray={activePageAccountsArray}
				/>
			);

			// Carousel
			var carousel = (
				<Carousel
					linkPreviewCanEdit={linkPreviewCanEdit}
					linkPreviewCanShow={linkPreviewCanShow}
					ref="carousel"
					updateParentState={this.linkPreviewSetState}
					id="linkCarousel"
				/>
			);

			// If the user has an account for the active tab connected
			if (activePageAccountsArray.length !== 0) {
				modalBody = (
					<div className="modal-body">
						<textarea
							className="postingTextArea"
							rows={5}
							placeholder="Success doesn't write itself!"
							onChange={event => {
								this.refs.carousel.findLink(event.target.value);
								this.handleChange("contentValue", event.target.value);
							}}
							value={contentValue}
						/>
						<ImagesDiv
							postImages={postImages}
							setPostImages={this.setPostImages}
							imageLimit={4}
							divID={"postCreationImagesDiv"}
						/>
						<h4
							className="center"
							style={{
								display: "inline-block",
								width: "100%",
								margin: "10px",
								padding: "0"
							}}
						>
							Choose an account to post to!
						</h4>
						{accountsListDiv}
						{carousel}
						<DatePicker clickedCalendarDate={date} callback={this.handleChange} />
						<TimePicker timeForPost={time} callback={this.handleChange} />
					</div>
				);
				modalFooter = (
					<div className="modal-footer">
						<button
							onClick={() => {
								let dateToPostInUtcTime = convertDateAndTimeToUtcTme(date, time, usersTimezone);
								if (
									!postChecks(
										postingToAccountId,
										dateToPostInUtcTime,
										usersTimezone,
										accountType,
										link,
										postImages,
										contentValue
									)
								) {
									return;
								}
								savePost(
									link,
									postingToAccountId,
									postImages,
									linkPreviewCanShow,
									activeTab,
									accountType,
									updateCalendarPosts,
									dateToPostInUtcTime,
									this.savePostCallback,
									contentValue,
									time,
									date
								);
								this.setState({ saving: true });
							}}
						>
							Save Post
						</button>
					</div>
				);
			} else {
				modalBody = (
					<div className="modal-body center">
						<h4>Connect {activeTab} Profile first!</h4>
					</div>
				);
				modalFooter = <div className="modal-footer" />;
			}
		} else if (activeTab === "blog") {
			modalBody = <CreateBlog clickedCalendarDate={date} updateCalendarBlogs={updateCalendarBlogs} />;
		}

		return (
			<div id="postingModal" className="modal">
				<div className="modal-content" style={{ textAlign: "center" }}>
					<span className="close-dark" onClick={() => close("contentModal")}>
						&times;
					</span>
					<div className="modal-header">
						<ContentModalHeader switchTabState={this.switchTabState} clearActiveDivs={this.clearActiveDivs} />
					</div>
					{modalBody}
					{modalFooter}
				</div>
			</div>
		);
	}
}

export default Modal;
