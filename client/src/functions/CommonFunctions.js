import moment from "moment-timezone";
import axios from "axios";

export function switchDateToUsersTimezoneInUtcForm(postingDate, zone) {
	var format = "YYYY/MM/DD HH:mm:ss ZZ";
	console.log(zone);

	var postingDateUtcOffset = postingDate.getTimezoneOffset();
	var userTimezoneUtcOffset = -moment(postingDate)
		.tz(zone)
		.utcOffset();

	var minutesToAdd = userTimezoneUtcOffset - postingDateUtcOffset;

	var finalDate = moment(postingDate, format)
		.add(minutesToAdd, "minutes")
		.utcOffset(0)
		.format();

	return finalDate;
}
export function savePost(
	link,
	accountIdToPostTo,
	postImages,
	linkPreviewCanShow,
	activeTab,
	accountType,
	updateCalendarPosts,
	dateToPostInUtcTime,
	callback,
	content,
	dateToPost
) {
	// Get current images
	var currentImages = [];
	for (var i = 0; i < postImages.length; i++) {
		currentImages.push(postImages[i].image);
	}

	// Get carousel html element
	var carousel;
	if (linkPreviewCanShow) {
		carousel = document.getElementById("linkCarousel");
	}

	// If link previews are allowed get src of active image from carousel
	var linkPreviewImage = "";
	if (link !== "") {
		if (carousel) {
			// Get active image from carousel
			linkPreviewImage = document.getElementsByClassName("owl-item active center")[0].children[0].children[0].src;
		}
	}

	// Now we have content of post, date (and time), account ID to post to, link preview image src and the link url

	// Set color of post
	var backgroundColorOfPost;
	if (activeTab === "facebook") {
		backgroundColorOfPost = "#4267b2";
	} else if (activeTab === "twitter") {
		backgroundColorOfPost = "#1da1f2";
	} else if (activeTab === "linkedin") {
		backgroundColorOfPost = "#0077b5";
	} else if (activeTab === "instagram") {
		backgroundColorOfPost = "#cd486b";
	}

	// Everything seems okay, save post to database!
	axios
		.post("/api/post", {
			accountID: accountIdToPostTo,
			content: content,
			postingDate: dateToPostInUtcTime,
			link: link,
			linkImage: linkPreviewImage,
			accountType: accountType,
			socialType: activeTab,
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
					updateCalendarPosts();
					callback();
				});
			} else {
				updateCalendarPosts();
				callback();
			}
		});
}
export function postChecks(
	postingToAccountId,
	dateToPostInUtcTime,
	usersTimezone,
	accountType,
	link,
	currentImages,
	content
) {
	var currentUtcDate = moment()
		.utcOffset(0)
		.format();
	// Make sure that the date is not in the past
	if (currentUtcDate > dateToPostInUtcTime) {
		alert("Time travel is not yet possible! Please select a date in the future not in the past!");
		return false;
	}

	if (postingToAccountId === "") {
		alert("Please select an account to post to!");
		return false;
	}

	// Check to make sure we have atleast a link, content, or an image
	if (content === "" && link === "" && currentImages === []) {
		alert("You are trying to create an empty post. We will not let you shoot yourself in the foot.");
		return;
	}
	return true;
}
export function convertDateAndTimeToUtcTme(date, time, usersTimezone) {
	// Combine time and date into one date variable
	var postingDate = new Date(date);
	var postingTime = new Date(time);
	postingDate.setHours(postingTime.getHours());
	postingDate.setMinutes(postingTime.getMinutes());
	return switchDateToUsersTimezoneInUtcForm(postingDate, usersTimezone);
}
export function roleCheck(role) {
	axios.get("/api/isUserSignedIn").then(res => {
		if (res.data[1].role !== role && res.data[1].role !== "admin") {
			window.location.replace("/content");
		}
	});
}
