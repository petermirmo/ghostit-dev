const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const analyticObjectSchema = new Schema(
  {
    value: [],
    title: String,
    description: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("analyticObjects", analyticObjectSchema);
