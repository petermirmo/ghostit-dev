var request = require("request");
var fs = require("fs");
const Blog = require("../models/Blog");

var cloudinary = require("cloudinary");

module.exports = {
	saveBlog: function(req, res) {
		let userID;
		if (req.user.signedInAsUser.id) {
			userID = req.user.signedInAsUser.id;
		} else {
			userID = req.user._id;
		}
		Blog.findOne({ _id: req.params.blogID }, async function(err, blog) {
			if (err) {
				console.log(err);
				res.send(err);
				return;
			}

			var data = req.body;
			var imageURL = {};
			var imagePublidID = {};
			var wordDocURL = {};
			var wordDocPublidID = {};
			var newBlog;
			if (blog) {
				newBlog = blog;
			} else {
				newBlog = new Blog();
			}
			if (req.files.image !== undefined) {
				if (newBlog.image.publicID) {
					await cloudinary.uploader.destroy(newBlog.image.publicID, function(error) {
						// TO DO: handle error here
						if (error) {
							console.log(error);
							res.send(false);
							return;
						}
					});
				}
				await cloudinary.v2.uploader.upload(req.files.image.path, function(error, result) {
					if (error) {
						console.log(error);
						res.send(error);
						return;
					}
					newBlog.image = { url: result.url, publicID: result.public_id };
				});
			}
			if (req.files.blogFile !== undefined) {
				// Delete old wordDoc
				if (newBlog.wordDoc.publicID) {
					await cloudinary.uploader.destroy(
						newBlog.wordDoc.publicID,
						function(error) {
							// TO DO: handle error here
							if (error) {
								console.log(error);
								res.send(false);
								return;
							}
						},
						{ resource_type: "raw" }
					);
				}
				await cloudinary.v2.uploader.upload(req.files.blogFile.path, { resource_type: "raw" }, function(error, result) {
					if (error) {
						console.log(error);
						res.send(error);
						return;
					}
					newBlog.wordDoc = { url: result.url, publicID: result.public_id, name: req.files.blogFile.name };
				});
			}

			newBlog.userID = userID;
			newBlog.postingDate = data.postingDate;
			newBlog.title = data.title;
			newBlog.resources = data.resources;
			newBlog.about = data.about;
			newBlog.eventColor = data.eventColor;
			newBlog.keywords = [
				{
					keyword: data.keyword1,
					keywordDifficulty: data.keywordDifficulty1,
					keywordSearchVolume: data.keywordSearchVolume1
				},
				{
					keyword: data.keyword2,
					keywordDifficulty: data.keywordDifficulty2,
					keywordSearchVolume: data.keywordSearchVolume2
				},
				{
					keyword: data.keyword3,
					keywordDifficulty: data.keywordDifficulty3,
					keywordSearchVolume: data.keywordSearchVolume3
				}
			];

			newBlog.save().then(result => {
				res.send(true);
			});
		});
	},
	getBlogs(req, res) {
		let userID;
		if (req.user.signedInAsUser.id) {
			userID = req.user.signedInAsUser.id;
		} else {
			userID = req.user._id;
		}
		Blog.find({ userID: userID }, function(err, blogs) {
			if (err) {
				res.send(false);
			}
			res.send(blogs);
		});
	},
	deleteBlog(req, res) {
		Blog.findOne({ _id: req.params.blogID }, async function(err, blog) {
			if (err) {
				handleError(res, err);
			} else if (blog) {
				if (blog.userID === req.user._id || req.user.role === "admin" || req.user.role === "manager") {
					if (blog.wordDoc.publicID) {
						await cloudinary.uploader.destroy(
							blog.wordDoc.publicID,
							function(error) {
								// TO DO: handle error here
								if (error) {
									console.log(error);
								}
							},
							{ resource_type: "raw" }
						);
					}
					if (blog.image.publicID) {
						await cloudinary.uploader.destroy(blog.image.publicID, function(error) {
							// TO DO: handle error here
							if (error) {
								console.log(error);
							}
						});
					}
					blog.remove().then(result => {
						res.send(true);
					});
				} else {
					handleError(res, "Hacker trying to delete posts");
				}
			} else {
				handleError(res, "Blog not found");
			}
		});
	}
};
function handleError(res, errorMessage) {
	console.log(errorMessage);
	res.send(false);
	return;
}
