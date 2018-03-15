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
		for (var index in req.files) {
		}
		if (req.files.image) {
			await cloudinary.v2.uploader.upload(req.files.image.path, function(error, result) {
				imageURL = result.url;
				imagePublidID = result.public_id;
			});
		}
		if (req.files.blogFile) {
			await cloudinary.v2.uploader.upload(req.files.blogFile.path, function(error, result) {
				wordDocURL = result.url;
				wordDocPublidID = result.public_id;
			});
		}

		var newBlog = new Blog();
		newBlog.title = data.title;
		newBlog.resources = data.resources;
		newBlog.about = data.about;
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
		newBlog.image = { url: imageURL, publicID: imagePublidID };
		newBlog.wordDoc = { url: wordDocURL, publicID: wordDocPublidID };
		console.log(newBlog);
		newBlog.save().then(result => res.send(result));
	}
};
