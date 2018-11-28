const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    category: {
      type: String
    },
    contentArray: [
      { text: String, css: [{ type: String, value: String }], location: Number }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("users", userSchema);
