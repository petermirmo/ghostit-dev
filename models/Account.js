const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = new Schema({
    userID: String,
    socialID: String,
    accessToken: String,
    socialType: String,
    accountType: String,
    givenName: String,
    familyName: String,
    email: String,
    provider: String,
    category: String
});

module.exports = mongoose.model("accounts", accountSchema);
