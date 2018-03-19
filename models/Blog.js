const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
	userID: String,
	postingDate: String,
	title: String,
	resources: String,
	about: String,
	eventColor: String,
	image: {
		url: String,
		publicID: String
	},
	wordDoc: {
		url: String,
		publicID: String,
		name: String
	},
	keywords: [{ keyword: String, keywordDifficulty: Number, keywordSearchVolume: Number }]
});

module.exports = mongoose.model("blogs", blogSchema);
