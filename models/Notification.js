const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    title: String,
    message: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("notifications", notificationSchema);
