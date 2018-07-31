const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = new Schema(
	{
		userID: String,
		socialID: String,
		accessToken: String,
		tokenSecret: String,
		socialType: String,
		accountType: String,
		givenName: String,
		familyName: String,
		username: String,
		email: String,
		provider: String,
		category: String,
		renewSuccess: Boolean,
		lastRenewed: Number
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("accounts", accountSchema);
