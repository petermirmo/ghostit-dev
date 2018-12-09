const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    userID: String,
    calendarID: Schema.Types.ObjectId,
    postingDate: String,
    dueDate: String,
    title: String,
    resources: String,
    about: String,
    color: String,
    socialType: String,
    image: {
      url: String,
      publicID: String
    },
    wordDoc: {
      url: String,
      publicID: String,
      name: String
    },
    keywords: [
      {
        keyword: String,
        keywordDifficulty: Number,
        keywordSearchVolume: Number
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("blogs", blogSchema);
