const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    userID: String,
    accountID: String,
    content: String,
    link: String,
    linkImage: String,
    postingDate: String,
    accountType: String,
    socialType: String,
    images: [
        {
            relativeURL: String,
            name: String
        }
    ]
});

module.exports = mongoose.model("posts", postSchema);
