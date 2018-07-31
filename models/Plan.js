const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlanSchema = new Schema(
	{
		socialPosts: Number,
		instagramPosts: Number,
		websiteBlogPosts: Number,
		emailNewsletters: Number,
		eBooks: Number,
		name: String,
		price: Number,
		createdBy: String,
		stripePlanID: String,
		currency: String
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("plans", PlanSchema);
