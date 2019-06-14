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
    accountName: String,
    postingTimeInSeconds: Number, // post-only variable unix epoch in seconds and UTC
    analytics: [
      // each element represents a different analytics metric
      {
        name: {
          type: String,
          required: true
        },
        title: String,
        description: String,
        lifetimeValues: [
          // this is how post analytics are stored
          {
            timeInSeconds: Number, // time of analytics being returned in unix epoch seconds UTC
            value: [
              {
                key: String,
                value: Number
              }
            ]
          }
        ],
        dailyValues: [
          // this is how account analytics are stored
          // each element represents a different day
          {
            dailyValue: [
              // multiple metrics like loves, likes, etc
              {
                date: Date,
                key: String,
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
      "dailyValues": [
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
      "dailyValues": [
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
