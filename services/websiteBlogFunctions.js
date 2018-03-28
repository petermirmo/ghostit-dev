var request = require("request");
var fs = require("fs");
const Blog = require("../models/Blog");

var cloudinary = require("cloudinary");

module.exports = {
	saveBlog: function(req, res) {
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
				if (newBlog.wordDoc) {
					await cloudinary.uploader.destroy(
						newBlog.wordDoc.publicID,
						function(error) {
							// TO DO: handle error here
							console.log(error);
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

			try {
				newBlog.save().then(result => res.send(result));
			} catch (e) {
				res.send(e);
			}
		});
	},
	getBlogs(req, res) {
		let userID;
		if (req.user.signedInAsUser) {
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
	}
};
