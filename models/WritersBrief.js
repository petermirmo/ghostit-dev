const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const writersBriefSchema = new Schema(
	{
		userID: String,
		cycleStartDate: Date,
		cycleEndDate: Date,
		socialPostsDescriptions: { facebook: String, instagram: String, twitter: String, linkedin: String }
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("writersBriefs", writersBriefSchema);
