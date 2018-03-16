var request = require("request");
var fs = require("fs");
const Blog = require("../models/Blog");

var cloudinary = require("cloudinary");

module.exports = {
	saveBlog: async function(req, res) {
		var data = req.body;
		var imageURL = {};
		var imagePublidID = {};
		var wordDocURL = {};
		var wordDocPublidID = {};
		var newBlog = new Blog();

		if (req.files.image !== undefined) {
			await cloudinary.v2.uploader.upload(req.files.image.path, function(error, result) {
				newBlog.image = { url: result.url, publicID: result.public_id };
			});
		}
		if (req.files.blogFile !== undefined) {
			await cloudinary.v2.uploader.upload(req.files.blogFile.path, function(error, result) {
				newBlog.wordDoc = { url: result.url, publicID: result.public_id };
			});
		}

		newBlog.userID = req.user.id;
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
			console.log(e);
			res.send(e);
		}
	},
	getBlogs(req, res) {
		Blog.find({ userID: req.user.id }, function(err, blogs) {
			if (err) {
				res.send(false);
			}
			res.send(blogs);
		});
	}
};
