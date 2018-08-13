const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newsletterSchema = new Schema(
	{
		userID: String,
		postingDate: String,
		dueDate: String,
		notes: String,
		color: String,
		socialType: String,
		wordDoc: {
			url: String,
			publicID: String,
			name: String
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("newsletters", newsletterSchema);
