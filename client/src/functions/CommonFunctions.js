import moment from "moment-timezone";
import axios from "axios";

export function switchDateToUsersTimezoneInUtcForm(postingDate, zone) {
	var format = "YYYY/MM/DD HH:mm:ss ZZ";

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
	content,
	dateToPostInUtcTime,
	link,
	postImages,
	accountIdToPostTo,
	socialType,
	accountType,
	callback
) {
	// Get current images
	let currentImages = [];
	for (let i = 0; i < postImages.length; i++) {
		currentImages.push(postImages[i].image);
	}

	// If link previews are allowed get src of active image from carousel
	let linkPreviewImage = "";
	if (link) {
		// Get active image from carousel
		linkPreviewImage = document.getElementsByClassName("owl-item active center")[0].children[0].children[0].src;
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
			socialType: socialType
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
					callback(res.data);
				});
			} else {
				callback(res.data);
			}
		});
}
export function postChecks(postingToAccountId, dateToPostInUtcTime, link, currentImages, content) {
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
export function carouselOptions(socialType) {
	if (socialType === "facebook") {
		return [true, false];
	} else if (socialType === "twitter") {
		return [false, false];
	} else if (socialType === "linkedin") {
		return [true, true];
	} else if (socialType === "instagram") {
		return [false, false];
	} else if (socialType === "blog") {
		return [false, false];
	} else if (socialType === "newsletter") {
		return [false, false];
	}
}
