const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    socialID: {
      type: String
    },
    accessToken: {
      type: String,
      required: true
    },
    tokenSecret: String,
    socialType: {
      type: String,
      required: true
    },
    accountType: {
      type: String,
      required: true
    },
    givenName: String,
    familyName: String,
    username: String,
    email: String,
    provider: String,
    category: String,
    renewSuccess: Boolean,
    lastRenewed: Number,
    analytics: [
      {
        startDate: String,
        endDate: String,
        values: [
          {
            title: String,
            description: String,
            value: []
          }
        ]
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("accounts", accountSchema);
