const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var contentSchema = new Schema({
  html: {
    type: String,
    required: true
  },
  location: {
    type: Number,
    required: true
  },
  link: String
});
var imageSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  publicID: {
    type: String,
    required: true
  },
  size: String,
  location: Number,
  alt: String
});

const ghostitBlogSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    category: Number,
    contentArray: [contentSchema],
    images: [imageSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ghostitBlogs", ghostitBlogSchema);
