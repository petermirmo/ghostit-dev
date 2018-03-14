import React, { Component } from "react";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";

import "../../css/theme.css";
import "../../css/carousel.css";
import DatePicker from "../DatePickerComponent.js";
import TimePicker from "../TimePickerComponent.js";
import Carousel from "../divs/Carousel.js";
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	// Turn off posting modal
	var postingModal = document.getElementById("postingModal");
	if (event.target === postingModal) {
		postingModal.style.display = "none";
		return;
	}

	// Turn off facebook pages modal
	var facebookModal = document.getElementById("addPagesOrGroupsModal");
	if (event.target === facebookModal) {
		facebookModal.style.display = "none";
		return;
	}

	var edittingModal = document.getElementById("edittingModal");
	if (event.target === edittingModal) {
		edittingModal.style.display = "none";
		return;
	}
};

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
		file: {}
	};
	constructor(props) {
		super(props);
		this.getUserAccounts();

		this.switchTabs = this.switchTabs.bind(this);
		this.removePhoto = this.removePhoto.bind(this);
		this.linkPreviewSetState = this.linkPreviewSetState.bind(this);
	}
	switchTabs(event, socialMedia) {
		if (socialMedia === "instagram") {
			return;
		}
		var clickedNavBarTab = event.target.parentNode;

		// Check if this is the active class
		if (clickedNavBarTab.classList.contains("active-column")) {
			// If it is already active tab, do nothing
			return;
		} else {
			this.clearActiveDivs();
			// Take away active class from all other tabs
			var tabs = document.getElementsByClassName("active-column");
			for (var index = 0; index < tabs.length; index++) {
				tabs[index].className = "column";
			}
			clickedNavBarTab.className += " active-column";
			if (socialMedia === "facebook") {
				this.setState({
					activeTab: socialMedia,
					linkPreviewCanShow: true,
					linkPreviewCanEdit: false,
					linkImagesArray: [],
					postingToAccountId: ""
				});
			} else if (socialMedia === "twitter") {
				this.setState({
					activeTab: socialMedia,
					linkPreviewCanShow: false,
					linkPreviewCanEdit: false,
					linkImagesArray: [],
					postingToAccountId: ""
				});
			} else if (socialMedia === "linkedin") {
				this.setState({
					activeTab: socialMedia,
					linkPreviewCanShow: true,
					linkPreviewCanEdit: true,
					linkImagesArray: [],
					postingToAccountId: ""
				});
			} else if (socialMedia === "instagram") {
				this.setState({
					activeTab: socialMedia,
					linkPreviewCanShow: false,
					linkPreviewCanEdit: false,
					linkImagesArray: [],
					postingToAccountId: ""
				});
			} else if (socialMedia === "blog") {
				this.setState({
					activeTab: socialMedia,
					linkPreviewCanShow: false,
					linkPreviewCanEdit: false,
					linkImagesArray: [],
					postingToAccountId: ""
				});
			} else if (socialMedia === "newsletter") {
				this.setState({
					activeTab: socialMedia,
					linkPreviewCanShow: false,
					linkPreviewCanEdit: false,
					linkImagesArray: [],
					postingToAccountId: ""
				});
			}
		}
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
	showFile(event) {
		console.log(event);
	}
	savePost() {
		// Get content of post
		var content = document.getElementById("contentPostingTextarea").value;

		// Get current images
		var currentImages = [];
		for (var i = 0; i < this.state.postImages.length; i++) {
			currentImages.push(this.state.postImages[i].image);
		}

		// Get date of post
		var datePickerDate = document.getElementById("contentDatePickerPopUp").getAttribute("getdate");

		// Get time of post
		var timePickerTime = document.getElementById("contentTimePickerPopUp").getAttribute("gettime");

		// Combine time and date into one date variable
		var postingDate = new Date(datePickerDate);
		var postingTime = new Date(timePickerTime);
		postingDate.setHours(postingTime.getHours());
		postingDate.setMinutes(postingTime.getMinutes());

		// Get carousel html element
		var carousel;
		if (this.state.linkPreviewCanShow) {
			carousel = document.getElementById("linkCarousel");
		}
		// Make sure that the date is not in the past
		var currentDate = new Date();

		if (postingDate < currentDate) {
			alert("Time travel is not yet possible! Please select a date in the future not in the past!");
			return;
		}

		var link = this.state.link;
		// If link previews are allowed get src of active image from carousel
		var linkPreviewImage = "";
		if (link !== "") {
			if (carousel) {
				// Get active image from carousel
				linkPreviewImage = document.getElementsByClassName("owl-item active center")[0].children[0].children[0].src;
			}
		}
		// Get account id to post to
		var accountIdToPostTo = this.state.postingToAccountId;

		if (accountIdToPostTo === "") {
			alert("Please select an account to post to!");
			return;
		}

		// Now we have content of post, date (and time), account ID to post to, link preview image src and the link url

		// Check to make sure we have atleast a link, content, or an image
		if (content === "" && link === "" && currentImages === []) {
			alert("You are trying to create an empty post. We will not let you shoot yourself in the foot.");
			return;
		}
		// Set color of post
		var backgroundColorOfPost;
		if (this.state.activeTab === "facebook") {
			backgroundColorOfPost = "#4267b2";
		} else if (this.state.activeTab === "twitter") {
			backgroundColorOfPost = "#1da1f2";
		} else if (this.state.activeTab === "linkedin") {
			backgroundColorOfPost = "#0077b5";
		} else if (this.state.activeTab === "instagram") {
			backgroundColorOfPost = "#cd486b";
		}

		// Everything seems okay, save post to database!
		axios
			.post("/api/post", {
				accountID: accountIdToPostTo,
				content: content,
				postingDate: postingDate,
				link: link,
				linkImage: linkPreviewImage,
				accountType: this.state.accountType,
				socialType: this.state.activeTab,
				status: "pending",
				color: backgroundColorOfPost
			})
			.then(res => {
				// Now we need to save images for post, Images are saved after post
				// Becuse they are handled so differently in the database
				// Text and images do not go well together
				var post = res.data;
				if (post._id && currentImages.length !== 0) {
					// Make sure post actually saved
					// Now we add images

					// Images must be uploaded via forms
					var formData = new FormData();
					formData.append("postID", post._id);

					// Attach all images to formData
					for (var i = 0; i < currentImages.length; i++) {
						formData.append("file", currentImages[i]);
					}
					// Make post request for images
					axios.post("/api/post/images", formData).then(res => {
						document.getElementById("postingModal").style.display = "none";
						this.props.updateCalendarPosts();
					});
				} else {
					document.getElementById("postingModal").style.display = "none";
					this.props.updateCalendarPosts();
				}
			});
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
			var carousel = (
				<Carousel
					linkPreviewCanEdit={this.state.linkPreviewCanEdit}
					linkPreviewCanShow={this.state.linkPreviewCanShow}
					ref="carousel"
					updateParentState={this.linkPreviewSetState}
					id="linkCarousel"
				/>
			);

			var activePageAccountsArray = [];
			var accountsListDiv = [];
			// Account divs
			// Loop through all account
			for (var index2 in this.state.accounts) {
				// Check if the account is the same as active tab
				if (this.state.accounts[index2].socialType === this.state.activeTab) {
					activePageAccountsArray.push(this.state.accounts[index2]);
				}
			}
			// To select which account to post to
			for (var index3 in activePageAccountsArray) {
				var name =
					activePageAccountsArray[index3].givenName.charAt(0).toUpperCase() +
					activePageAccountsArray[index3].givenName.slice(1);
				if (activePageAccountsArray[index3].familyName) {
					name +=
						" " +
						activePageAccountsArray[index3].familyName.charAt(0).toUpperCase() +
						activePageAccountsArray[index3].familyName.slice(1);
				}
				// Push div to array
				var div = (
					<div
						id={activePageAccountsArray[index3]._id}
						key={index3}
						className="connected-accounts-posting-div"
						onClick={event => this.postingAccountNav(event)}
					>
						<h4>{name}</h4>
						<p>{activePageAccountsArray[index3].accountType}</p>
					</div>
				);
				accountsListDiv.push(div);
			}
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
						<div className="connected-accounts-container center">{accountsListDiv}</div>
						{carousel}
						<DatePicker clickedCalendarDate={this.props.clickedCalendarDate} id="contentDatePickerPopUp" />
						<TimePicker timeForPost={this.props.timeForPost} id="contentTimePickerPopUp" />
					</div>
				);
				modalFooter = (
					<div className="modal-footer">
						<button onClick={() => this.savePost()}>Save Post</button>
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
		} else {
			var fileDiv;
			modalBody = (
				<div className="modal-body">
					<form id="createBlogForm" action="/api/blog" method="post" className="create-blog-form">
						<input
							type="text"
							name="title"
							placeholder="Working Title"
							align="left"
							className="create-blog-form-regular"
							required
						/>
						<input type="text" name="keyword1" placeholder="Keyword 1" className="create-blog-form-keyword" required />
						<input
							type="text"
							name="keywordDifficulty1"
							placeholder="Keyword Difficulty"
							className="create-blog-form-keyword"
							required
						/>
						<input
							type="text"
							name="keywordSearchVolume1"
							placeholder="Search Volume"
							className="create-blog-form-keyword"
							required
						/>
						<input type="text" name="keyword2" placeholder="Keyword 2" className="create-blog-form-keyword" />
						<input
							type="text"
							name="keywordDifficulty2"
							placeholder="Keyword Difficulty"
							className="create-blog-form-keyword"
						/>
						<input
							type="text"
							name="keywordSearchVolume2"
							placeholder="Search Volume"
							className="create-blog-form-keyword"
						/>
						<input type="text" name="keyword3" placeholder="Keyword 3" className="create-blog-form-keyword" />
						<input
							type="text"
							name="keywordDifficulty3"
							placeholder="Keyword Difficulty"
							className="create-blog-form-keyword"
						/>
						<input
							type="text"
							name="keywordSearchVolume3"
							placeholder="Search Volume"
							className="create-blog-form-keyword"
						/>
						<textarea form="createBlogForm" name="resources" placeholder="Resources" rows={2} />
						<textarea form="createBlogForm" name="about" placeholder="About(notes)" rows={2} />
						<label
							htmlFor="blogUploadImage"
							className="custom-file-upload"
							style={{ marginBottom: "5px", marginTop: "5px" }}
						>
							Upload an image!
						</label>
						<input
							id="blogUploadImage"
							type="file"
							name="blogImage"
							placeholder="Working Title"
							className="create-blog-form-regular"
							onChange={event => this.showImages(event)}
							required
						/>
						{imagesDiv}
						<label
							htmlFor="blogUploadWordDoc"
							className="custom-file-upload"
							style={{ marginBottom: "10px", marginTop: "5px" }}
						>
							Upload Word Document
						</label>
						<input
							id="blogUploadWordDoc"
							type="file"
							name="blogWordDoc"
							placeholder="Working Title"
							className="create-blog-form-regular"
							onChange={event => this.showFile(event)}
							required
						/>
					</form>
					{fileDiv}
				</div>
			);
			modalFooter = (
				<div className="modal-footer">
					<button>Save Post</button>
				</div>
			);
		}

		return (
			<div id="postingModal" className="modal">
				<div className="modal-content" style={{ textAlign: "center" }}>
					<div className="modal-header">
						<div className="row">
							<div className="column active-column">
								<button onClick={event => this.switchTabs(event, "facebook")}>Facebook</button>
							</div>

							<div className="column">
								<button onClick={event => this.switchTabs(event, "twitter")}>Twitter</button>
							</div>

							<div className="column">
								<button onClick={event => this.switchTabs(event, "linkedin")}>Linkedin</button>
							</div>

							<div className="column">
								<button onClick={event => this.switchTabs(event, "blog")}>Website Blog</button>
							</div>

							<div className="column">
								<button onClick={event => this.switchTabs(event, "newsletter")}>Email Newsletter</button>
							</div>

							<div
								className="column"
								style={{
									background: "linear-gradient(90deg, #cd486b, #8a3ab9)"
								}}
								onClick={event => this.switchTabs(event, "instagram")}
							>
								<button>Coming Soon!</button>
							</div>
						</div>
					</div>
					{modalBody}
					{modalFooter}
				</div>
			</div>
		);
	}
}

export default Modal;
