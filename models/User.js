const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	role: String,
	email: String,
	password: String,
	fullName: String,
	country: String,
	timezone: String,
	website: String,
	signedInAsUser: { id: String, fullName: String },
	writer: { id: String, name: String },
	plan: { id: String, name: String },
	stripeCustomerID: String,
	stripeSubscriptionID: String
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("users", userSchema);
