const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipe = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    startDate: Date,
    endDate: Date,
    color: String,
    name: String,
    recipeID: {
      type: Schema.Types.ObjectId
    },
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
