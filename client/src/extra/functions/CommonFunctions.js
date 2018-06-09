import moment from "moment-timezone";
import axios from "axios";

export async function savePost(
	id,
	content,
	dateToPostInUtcTime,
	link,
	linkImage,
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
	if (linkImage) {
		linkPreviewImage = linkImage;
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
			let { post, success, loggedIn } = res.data;
			if (success) {
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
			} else {
				if (loggedIn === false) window.location.reload();
			}
		});
}
export function postChecks(postingToAccountId, dateToPostInUtcTime, link, currentImages, content) {
	let currentUtcDate = moment().utcOffset(0);
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
