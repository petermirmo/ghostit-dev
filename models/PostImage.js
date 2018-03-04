const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    postID: String,
    name: String,
    data: Buffer
});

module.exports = mongoose.model("postImages", imageSchema);
