const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const analyticsSchema = new Schema(
  {
    analyticType: {
      // "post" or "account"
      type: String,
      required: true
    },
    associatedID: {
      // post / account ID that this object is associated with
      type: String,
      required: true,
      unique: true
    },
    analyitcs: [
      // each element represents a different analytics metric
      {
        title: {
          type: String,
          required: true
        },
        description: String,
        monthlyValues: [
          // each element represents a different month/year
          {
            month: Number,
            year: Number,
            values: [
              // each element represents a different day within the month
              {
                day: Number,
                value: Number
              }
            ]
          }
        ]
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("analytics", analyticsSchema);
