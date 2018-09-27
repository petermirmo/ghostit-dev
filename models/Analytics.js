const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const analyticsSchema = new Schema(
  {
    socialType: {
      // "facebook" or "twitter" etc.
      type: String,
      required: true
    },
    analyticsType: {
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
        name: {
          type: String,
          required: true
        },
        title: String,
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

/*
Example object:

{
  socialType: "facebook,"
  analyticsType: "account",
  associatedID: "32535235235",
  analytics: [
    {
      "name": "page_video_views_organic",
      "title": "Daily Total Organic Views",
      "description": "Daily: Number of times a video has been viewed due to organic reach (Total Count)",
      "monthlyValues": [
        {
          "month": 9,
          "year": 2018,
          "values": [
            {
              "day": 29,
              "value": [
                {
                  "key": "value",
                  "value": 0
                }
              ]
            },
            {
              "day": 30,
              "value": [
                {
                  "key": "likes",
                  "value": 1
                },
                {
                  "key": "loves",
                  "value": 3
                }
              ]
            }
          ]
        },
        {
          "month": 10,
          "year": 2018,
          "values": [
            {
              "day": 1,
              "value": [
                {
                  "key": "value",
                  "value": 2
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "page_video_views_unique",
      "title": "Daily Total Unique Views",
      "description": "Daily: Number of times a video has been viewed by a unique user (Total Count)",
      "monthlyValues": [
        {
          "month": 9,
          "year": 2018,
          "values": [
            {
              "day": 29,
              "value": [
                {
                  "key": "value",
                  "value": 0
                }
              ]
            },
            {
              "day": 30,
              "value": [
                {
                  "key": "likes",
                  "value": 1
                },
                {
                  "key": "loves",
                  "value": 3
                }
              ]
            }
          ]
        },
        {
          "month": 10,
          "year": 2018,
          "values": [
            {
              "day": 1,
              "value": [
                {
                  "key": "value",
                  "value": 2
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
*/
