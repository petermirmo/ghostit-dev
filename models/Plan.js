const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlanSchema = new Schema({
	socialPosts: {
		amount: Number,
		frequency: Number
	},
	facebookPosts: {
		amount: Number,
		frequency: Number
	},
	twitterPosts: {
		amount: Number,
		frequency: Number
	},
	linkedinPosts: {
		amount: Number,
		frequency: Number
	},
	instagramPosts: {
		amount: Number,
		frequency: Number
	},
	websiteBlogPosts: {
		amount: Number,
		frequency: Number
	},
	emailNewsletters: {
		amount: Number,
		frequency: Number
	},
	eBooks: {
		amount: Number,
		frequency: Number
	}
});

module.exports = mongoose.model("plans", PlanSchema);
