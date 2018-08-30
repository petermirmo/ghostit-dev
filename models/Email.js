const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const emailSchema = new Schema(
  {
    userID: Schema.Types.ObjectId,
    postID: Schema.Types.ObjectId
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("emails", emailSchema);
