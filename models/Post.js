const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		userID: String,
		accountID: String,
		content: String,
		instructions: String,
		link: String,
		linkImage: String,
		postingDate: String,
		accountType: String,
		socialType: String,
		status: String,
		errorMessage: String,
		socialMediaID: String,
		color: String,
		campaignID: Schema.Types.ObjectId,
		name: String,
		images: [
			{
				url: String,
				publicID: String
			}
		]
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("posts", postSchema);
