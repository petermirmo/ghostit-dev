const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipe = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    creator: String,
    useCount: Number,
    startDate: Date,
    endDate: Date,
    color: String,
    name: String,
    description: String,
    posts: [
      {
        content: String,
        instructions: String,
        link: String,
        linkImage: String,
        postingDate: String,
        socialType: String,
        errorMessage: String,
        color: String,
        name: String,
        images: [
          {
            url: String,
            publicID: String
          }
        ]
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("recipes", recipe);
