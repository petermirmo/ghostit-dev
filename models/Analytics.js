const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const analyticSchema = new Schema(
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
      (dataOfMonth: [
        {
          groupName: String,
          dataList: [
            {
              dataID: {
                type: Schema.Types.ObjectId,
                required: true
              }
            }
          ]
        }
      ])
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("analytics", analyticSchema);
