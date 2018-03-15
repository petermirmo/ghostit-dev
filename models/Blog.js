const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
	title: String,
	resources: String,
	about: String,
	image: {
		url: String,
		publicID: String
	},
	wordDoc: {
		url: String,
		publicID: String
	},
	keywords: [{ keyword: String, keywordDifficulty: Number, keywordSearchVolume: Number }]
});

module.exports = mongoose.model("blogs", blogSchema);
