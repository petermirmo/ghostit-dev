const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountAnalyticsSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    accountID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    socialType: String,
    monthlyData: [
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

module.exports = mongoose.model("accountAnalytics", accountAnalyticsSchema);
