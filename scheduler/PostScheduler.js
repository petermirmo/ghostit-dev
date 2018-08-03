const Post = require("../models/Post");

let facebook = require("./facebook");
let twitter = require("./twitter");
let linkedin = require("./linkedin");
module.exports = {
	main: function() {
		return;
		Post.find({ status: "pending" }).then(result => {
			let postArray = result;
			let currentDate = new Date();

			for (let index in postArray) {
				let post = postArray[index];
				let postingDate = new Date(post.postingDate);
				if (postingDate < currentDate) {
					post.status = "working";
					post.save();
				}
			}

			for (let index in postArray) {
				let post = postArray[index];
				let postingDate = new Date(post.postingDate);
				if (postingDate < currentDate) {
					// Needs to post
					if (post.socialType === "facebook") {
						if (post.accountType === "profile" || post.accountType === "page") {
							facebook.postToProfileOrPage(post);
						} else if (post.accountType === "group") {
							facebook.postToGroup(post);
						} else {
							// TO DO: send error
						}
					} else if (post.socialType === "twitter") {
						if (post.accountType === "profile") {
							twitter.postToProfile(post);
						} else {
							// TO DO: send error
						}
					} else if (post.socialType === "linkedin") {
						if (post.accountType === "profile") {
							linkedin.postToProfile(post);
						} else if (post.accountType === "page") {
							linkedin.postToPage(post);
						} else {
							// TO DO: send error
						}
					}
				}
			}
		});
	}
};
