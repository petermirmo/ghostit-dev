import React, { Component } from "react";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";

import "../../css/theme.css";
import "../../css/carousel.css";
import DatePicker from "../DatePickerComponent.js";
import TimePicker from "../TimePickerComponent.js";
import Carousel from "../divs/Carousel.js";
import CreateBlog from "../forms/CreateBlog.js";
import savePost from "../../functions/SavePost.js";
import SelectAccountDiv from "../divs/SelectAccountDiv.js";
import ContentModalHeader from "../divs/ContentModalHeader.js";

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
		accountType: ""
	};
	constructor(props) {
		super(props);
		this.getUserAccounts();

		this.removePhoto = this.removePhoto.bind(this);
		this.linkPreviewSetState = this.linkPreviewSetState.bind(this);
		this.showImages = this.showImages.bind(this);
		this.postingAccountNav = this.postingAccountNav.bind(this);
		this.switchTabState = this.switchTabState.bind(this);
		this.clearActiveDivs = this.clearActiveDivs.bind(this);
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

	showImages(event) {
		var images = event.target.files;
		// Check to make sure there are not more than 4 Images
		if (images.length > 4) {
			alert("You have selected more than 4 images! Please try again");
			return;
		}

		// Check to make sure each image is under 5MB
		for (var index = 0; index < images.length; index++) {
			if (images[index].size > 5000000) {
				alert("File size on one or more photos is over 5MB( Please try again");
				return;
			}
		}

		// Save each image to state
		var imagesArray = [];
		for (index = 0; index < images.length; index++) {
			let reader = new FileReader();
			let image = images[index];
			reader.onloadend = () => {
				var imageObject = {
					image: image,
					imagePreviewUrl: reader.result
				};
				imagesArray.push(imageObject);
				if (index === images.length) {
					this.setState({ postImages: imagesArray });
				}
			};

			reader.readAsDataURL(image);
		}
	}
	removePhoto(event) {
		var currentImages = this.state.postImages;
		// <i> tag can be clicked as well as image tag, so this code checks siblings to make sure we got the <img> tag
		var clickedImage = event.target.previousElementSibling;
		if (clickedImage === null) {
			clickedImage = event.target;
		}

		// ID of img tag is image + index in the array ex. image1
		// We will remove "image" leaving us with just the index
		var indexOfRemovalImage = clickedImage.id.replace("image", "");
		currentImages.splice(indexOfRemovalImage, 1);
		this.setState({ postImages: currentImages });
	}

	linkPreviewSetState(link, imagesArray) {
		this.setState({ link: link, linkImagesArray: imagesArray });
	}

	render() {
		var modalBody;
		var modalFooter;

		// Show preview images
		var imagesDiv = [];
		var currentImages = this.state.postImages;
		for (var index4 in currentImages) {
			// If image has been removed index will equal null
			var imageTag = (
				<div key={index4} className="image-container delete-image-container" onClick={event => this.removePhoto(event)}>
					<img id={"image" + index4.toString()} key={index4} src={currentImages[index4].imagePreviewUrl} alt="error" />
					<i className="fa fa-times fa-3x" />
				</div>
			);
			imagesDiv.push(imageTag);
		}

		// Check if this is an email or blog placeholder
		if (this.state.activeTab !== "blog" && this.state.activeTab !== "newsletter") {
			// Loop through all accounts
			var activePageAccountsArray = [];
			for (var index in this.state.accounts) {
				// Check if the account is the same as active tab
				if (this.state.accounts[index].socialType === this.state.activeTab) {
					activePageAccountsArray.push(this.state.accounts[index]);
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
					linkPreviewCanEdit={this.state.linkPreviewCanEdit}
					linkPreviewCanShow={this.state.linkPreviewCanShow}
					ref="carousel"
					updateParentState={this.linkPreviewSetState}
					id="linkCarousel"
				/>
			);

			var fileUploadDiv;
			if (currentImages.length < 4) {
				fileUploadDiv = (
					<div>
						<label htmlFor="file-upload" className="custom-file-upload">
							Upload Images! (Up to four)
						</label>

						<input id="file-upload" type="file" onChange={event => this.showImages(event)} multiple />
					</div>
				);
			}

			// If the user has an account for the active tab connected
			if (activePageAccountsArray.length !== 0) {
				modalBody = (
					<div className="modal-body">
						<textarea
							id="contentPostingTextarea"
							className="postingTextArea"
							rows={5}
							placeholder="Success doesn't write itself!"
							onChange={event => this.refs.carousel.findLink(event.target.value)}
						/>
						{fileUploadDiv}
						{imagesDiv}
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
						<DatePicker clickedCalendarDate={this.props.clickedCalendarDate} id="contentDatePickerPopUp" />
						<TimePicker timeForPost={this.props.timeForPost} id="contentTimePickerPopUp" />
					</div>
				);
				modalFooter = (
					<div className="modal-footer">
						<button
							onClick={() =>
								savePost(
									this.state.link,
									this.state.accountIdToPostTo,
									this.state.postImages,
									this.state.linkPreviewCanShow,
									this.state.activeTab,
									this.state.accountType,
									this.props.updateCalendarPosts
								)
							}
						>
							Save Post
						</button>
					</div>
				);
			} else {
				modalBody = (
					<div className="modal-body center">
						<h4>Connect {this.state.activeTab} Profile first!</h4>
					</div>
				);
				modalFooter = <div className="modal-footer" />;
			}
		} else if (this.state.activeTab === "blog") {
			modalBody = <CreateBlog imagesDiv={imagesDiv} showImages={this.showImages} postImages={this.state.postImages} />;
		}

		return (
			<div id="postingModal" className="modal">
				<div className="modal-content" style={{ textAlign: "center" }}>
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
