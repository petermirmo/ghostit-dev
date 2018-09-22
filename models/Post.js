const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    accountID: {
      type: Schema.Types.ObjectId
    },
    content: String,
    instructions: String,
    link: String,
    linkImage: String,
    postingDate: String,
    accountType: String,
    socialType: String,
    status: String,
    errorMessage: String,
    socialMediaID: String,
    color: String,
    campaignID: Schema.Types.ObjectId,
    name: String,
    emailReminder: Schema.Types.ObjectId,
    images: [
      {
        url: String,
        publicID: String
      }
    ],
    analyticsID: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("posts", postSchema);
