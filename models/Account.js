const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    accessToken: {
      type: String,
      required: true
    },
    accountType: {
      type: String,
      required: true
    },
    analyticsID: String,
    category: String,
    email: String,
    givenName: String,
    familyName: String,
    lastRenewed: Number,
    provider: String,
    renewSuccess: Boolean,
    socialID: {
      type: String
    },
    socialType: {
      type: String,
      required: true
    },
    tokenSecret: String,
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    username: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("accounts", accountSchema);
