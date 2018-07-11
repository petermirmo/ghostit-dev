const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const campaign = new Schema({
	userID: Schema.Types.ObjectId,
	startDate: Date,
	endDate: Date,
	color: String,
	name: String,
	posts: [{ id: Schema.Types.ObjectId }]
});

module.exports = mongoose.model("campaigns", campaign);
