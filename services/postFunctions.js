var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

const Post = require("../models/Post");
const User = require("../models/User");
var cloudinary = require("cloudinary");

module.exports = {
	getImagesFromUrl: function(req, res) {
		var url = req.body.link;
		request(url, function(err, result, body) {
			if (err) {
				console.log(err);
				res.send(false);
				return;
			}
			var imgSrc = [];
			if (!body) {
				console.log("No images found");
				res.send(false);
				return;
			}
			var $ = cheerio.load(body);
			$("img").each(function(index, img) {
				imgSrc.push(img.attribs.src);
			});
			res.send(imgSrc);
		});
	},
	savePost: function(req, res) {
		var post = req.body;
		var newPost = new Post();
		let userID;
		if (req.user.signedInAsUser.id) {
			userID = req.user.signedInAsUser.id;
		} else {
			userID = req.user._id;
		}
		// Set color of post
		let backgroundColorOfPost;
		if (post.socialType === "facebook") {
			backgroundColorOfPost = "#4267b2";
		} else if (post.socialType === "twitter") {
			backgroundColorOfPost = "#1da1f2";
		} else if (post.socialType === "linkedin") {
			backgroundColorOfPost = "#0077b5";
		} else if (post.socialType === "instagram") {
			backgroundColorOfPost = "#cd486b";
		}
		newPost.userID = userID;
		newPost.accountID = post.accountID;
		newPost.content = post.content;
		newPost.postingDate = post.postingDate;
		newPost.link = post.link;
		newPost.linkImage = post.linkImage;
		newPost.accountType = post.accountType;
		newPost.socialType = post.socialType;
		newPost.color = backgroundColorOfPost;
		newPost.status = "pending";

		newPost.save().then(result => res.send(result));
	},
	getPosts: function(req, res) {
		// Get all posts for user
		let userID;
		if (req.user.signedInAsUser.id) {
			userID = req.user.signedInAsUser.id;
		} else {
			userID = req.user._id;
		}
		//Post.findOne({ _id: "5ad206819225d4001440bbbb" }, function(err, posts) {

		Post.find({ userID: userID }, function(err, posts) {
			if (err) res.send(err);
			res.send(posts);
		});
	},
	getPost: function(req, res) {
		Post.findOne({ _id: req.params.postID }, function(err, post) {
			if (err) res.send(err);

			res.send(post);
		});
	},
	updatePost: function(req, res) {
		Post.findOne({ _id: req.params.postID }, function(err, post) {
			if (err) res.send(err);
			var edittedPost = req.body;
			post.accountID = edittedPost.accountID;
			post.content = edittedPost.content;
			post.postingDate = edittedPost.postingDate;
			post.link = edittedPost.link;
			post.linkImage = edittedPost.linkImage;
			post.accountType = edittedPost.accountType;
			post.socialType = edittedPost.socialType;
			post.save().then(post => res.send(post));
		});
	},
	uploadPostImages: function(req, res) {
		var postID = req.body.postID;
		Post.findOne({ _id: postID }, async function(err, post) {
			if (err) res.send(false);

			if (Array.isArray(req.files.file)) {
				// There are multiple files
				for (var i = 0; i < req.files.file.length; i++) {
					// Must be await so results are not duplicated
					await cloudinary.v2.uploader.upload(req.files.file[i].path, function(error, result) {
						post.images.push({
							url: result.url,
							publicID: result.public_id
						});
					});
				}
				post.save().then(result => res.send(true));
			} else {
				// Only one file
				await cloudinary.v2.uploader.upload(req.files.file.path, function(error, result) {
					post.images.push({
						url: result.url,
						publicID: result.public_id
					});
					post.save().then(result => res.send(true));
				});
			}
		});
	},
	deletePostImages: async function(req, res) {
		var deleteImagesArray = req.body;

		// Delete images from cloudinary
		for (var i = 0; i < deleteImagesArray.length; i++) {
			await cloudinary.uploader.destroy(deleteImagesArray[i].publicID, function(result) {
				// TO DO: handle error here
			});
		}
		Post.findOne({ _id: req.params.postID }, function(err, post) {
			for (i = 0; i < post.images.length; i++) {
				for (j = 0; j < deleteImagesArray.length; j++) {
					if (post.images[i].publicID === deleteImagesArray[j].publicID) {
						post.images.splice(i, 1);
					}
				}
			}
			post.save().then(result => res.send(true));
		});
	},
	deletePost: function(req, res) {
		Post.findOne({ _id: req.params.postID }, async function(err, post) {
			if (post.images) {
				for (var i = 0; i < post.images.length; i++) {
					await cloudinary.uploader.destroy(post.images[i].publicID, function(result) {
						// TO DO: handle error here
					});
				}
			}
			post.remove().then(result => {
				res.send(true);
			});
		});
	}
};
