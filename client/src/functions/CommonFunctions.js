import moment from "moment-timezone";
import axios from "axios";

export function switchDateToUsersTimezoneInUtcForm(postingDate, zone) {
	let format = "YYYY/MM/DD HH:mm:ss ZZ";

	let postingDateUtcOffset = postingDate.getTimezoneOffset();
	let userTimezoneUtcOffset = -moment(postingDate)
		.tz(zone)
		.utcOffset();

	let minutesToAdd = userTimezoneUtcOffset - postingDateUtcOffset;

	let finalDate = moment(postingDate, format)
		.add(minutesToAdd, "minutes")
		.utcOffset(0)
		.format();

	return finalDate;
}
export async function savePost(
	id,
	content,
	dateToPostInUtcTime,
	link,
	postImages,
	accountIdToPostTo,
	socialType,
	accountType,
	callback,
	deleteImagesArray
) {
	if (deleteImagesArray) {
		if (deleteImagesArray.length !== 0) {
			await axios.post("/api/post/delete/images/" + id, deleteImagesArray);
		}
	}

	// Get current images
	let imagesToSave = [];
	for (let i = 0; i < postImages.length; i++) {
		if (!postImages[i].url) imagesToSave.push(postImages[i].image);
	}

	// If link previews are allowed get src of active image from carousel
	let linkPreviewImage = "";
	if (link) {
		// Get active image from carousel
		if (document.getElementsByClassName("owl-item active center")[0].children[0].children[0])
			linkPreviewImage = document.getElementsByClassName("owl-item active center")[0].children[0].children[0].src;
	}

	// Everything seems okay, save post to database!
	axios
		.post("/api/post", {
			id: id,
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
			let post = res.data;
			if (post._id && imagesToSave.length !== 0) {
				// Make sure post actually saved
				// Now we add images

				// Images must be uploaded via forms
				let formData = new FormData();
				formData.append("postID", post._id);

				// Attach all images to formData
				for (let i = 0; i < imagesToSave.length; i++) {
					formData.append("file", imagesToSave[i]);
				}
				// Make post request for images
				axios.post("/api/post/images", formData).then(res => {
					callback();
				});
			} else {
				callback();
			}
		});
}
export function postChecks(postingToAccountId, dateToPostInUtcTime, link, currentImages, content) {
	let currentUtcDate = moment()
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
export function convertDateAndTimeToUtcTme(date, time, timezone) {
	// Combine time and date into one date letiable
	let postingDate = new Date(date);
	let postingTime = new Date(time);
	postingDate.setHours(postingTime.getHours());
	postingDate.setMinutes(postingTime.getMinutes());

	return switchDateToUsersTimezoneInUtcForm(postingDate, timezone);
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
