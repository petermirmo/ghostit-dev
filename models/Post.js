const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    accountID: String,
    accountType: String,
    analyticsID: String,
    calendarID: Schema.Types.ObjectId,
    campaignID: Schema.Types.ObjectId,
    color: String,
    content: String,
    emailReminder: Schema.Types.ObjectId,
    errorMessage: String,
    files: [
      {
        publicID: String,
        url: String
      }
    ],
    instructions: String,
    link: String,
    linkImage: String,
    linkCustomFiles: [{ publicID: String, url: String }],
    linkDescription: String,
    linkTitle: String,
    name: String,
    postingDate: Date,
    status: String,
    socialMediaID: String,
    socialType: String,
    videoTitle: String,
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("posts", postSchema);
