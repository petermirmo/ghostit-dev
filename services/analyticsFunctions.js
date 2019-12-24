const User = require("../models/User");
const Analytics = require("../models/Analytics");
const Account = require("../models/Account");
const Post = require("../models/Post");
const FB = require("fb");
const Instagram = require("node-instagram").default;

const moment = require("moment-timezone");

const generalFunctions = require("./generalFunctions");
const keys = require("../config/keys");

const { getUserID } = require("../util");
const { fbPostRequest } = require("../constants");

process_fb_page_analytics = (data, prevObject) => {
  /*
  input:
    {
      "name": "page_video_views_organic",
      "period": "day",
      "values": [
        {
          "value": 0,
          "end_time": "2018-09-30T07:00:00+0000"
        },
        {
          "value": { "likes": 1, "loves": 3 },
          "end_time": "2018-10-01T07:00:00+0000"
        },
        {
          "value": 2,
          "end_time": "2018-10-02T07:00:00+0000"
        }
      ],
      "title": "Daily Total Organic Views",
      "description": "Daily: Number of times a video has been viewed due to organic reach (Total Count)",
      "id": "1209545782519940/insights/page_video_views_organic/day"
    }
  output:
  {
    "name": "page_video_views_organic",
    "title": "Daily Total Organic Views",
    "description": "Daily: Number of times a video has been viewed due to organic reach (Total Count)",
    "dailyValues": [
      {
        "values": [
          {
            "value": [
              {
                "date":
                "key": "value",
                "value": 0
              }
            ]
          },
          {
            "value": [
              {
                "date":
                "key": "likes",
                "value": 1
              },
              {
                "date":
                "key": "loves",
                "value": 3
              }
            ]
          }
        ]
      },
      {
        "values": [
          {
            "value": [
              {
                "date":
                "key": "value",
                "value": 2
              }
            ]
          }
        ]
      }
    ]
  }
  */
  let result = {
    name: data.name,
    title: data.title,
    description: data.description,
    dailyValues: []
  };
  if (prevObject && prevObject.dailyValues) {
    result.dailyValues = [...prevObject.dailyValues];
  }

  for (let i = 0; i < data.values.length; i++) {
    /*
    currentData =
      {
        "value": { "likes": 1, "loves": 3 },
        "end_time": "2018-10-01T07:00:00+0000" // this date is 11pm sept 30th PST
      }
      in DB:
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
      }
    */
    const currentData = data.values[i];

    let lastStoredDataDate = 0;
    if (
      result.dailyValues[result.dailyValues.length - 1] &&
      result.dailyValues[result.dailyValues.length - 1].dailyValue &&
      result.dailyValues[result.dailyValues.length - 1].dailyValue[0]
    ) {
      lastStoredDataDate = new moment(
        result.dailyValues[result.dailyValues.length - 1].dailyValue[0].date
      ).valueOf();
    }
    const dateOfNewData = new moment(currentData.end_time);

    if (lastStoredDataDate >= dateOfNewData.valueOf()) continue;

    let valueArray = [];
    if (
      Number.isInteger(currentData.value) ||
      typeof currentData.value === "string" ||
      currentData.value instanceof String
    ) {
      // if the value is just a simple number or string then we label it "value"
      valueArray = [
        {
          key: "value",
          value: currentData.value,
          date: dateOfNewData
        }
      ];
    } else {
      for (let index in currentData.value) {
        if (
          Number.isInteger(currentData.value[index]) ||
          typeof currentData.value[index] === "string" ||
          currentData.value[index] instanceof String
        ) {
          valueArray.push({
            key: index,
            value: currentData.value[index],
            date: dateOfNewData
          });
        } else {
          for (let index2 in currentData.value[index]) {
            valueArray.push({
              key: index2,
              value: currentData.value[index][index2],
              date: dateOfNewData
            });
          }
        }
      }
    }
    if (valueArray.length === 0) {
      continue;
    }

    result.dailyValues.push({ dailyValue: valueArray });
  }
  return result;
};

process_fb_post_analytics = (data, prevObject) => {
  /*
    data:
      {
        "name": "post_activity_by_action_type",
        "period": "lifetime",
        "values": [
          {
            "value": {
              "like": 3,
              "comment": 3
            }
          }
        ],
        "title": "Lifetime Post Stories by action type",
        "description": "Lifetime: The number of stories created about your Page post, by action type. (Total Count)",
        "id": "1209545782519940_1219695484838303/insights/post_activity_by_action_type/lifetime"
      }

    output:
      {
        name: "post_activity_by_action_type",
        title: "Lifetime Post Stories by action type",
        description: "Lifetime: The number of stories created about your Page post, by action type. (Total Count)",
        lifetimeValues: [
          {
            time: 1539043286999,
            value: [
              {
                key: "like",
                value: 3
              },
              {
                key: "comment",
                value: 3
              }
            ]
          }
        ]
      }
  */
  const result = {
    name: data.name,
    title: data.title,
    description: data.description
  };
  if (prevObject && prevObject.lifetimeValues) {
    result.lifetimeValues = [...prevObject.lifetimeValues];
  } else {
    result.lifetimeValues = [];
  }
  if (data.values.length > 1) {
    console.log(
      "metric " +
        data.name +
        " has multiple values and needs new code written to handle it."
    );
    return result;
  } else if (data.values.length === 0) {
    console.log("metric " + data.name + " has 0 values.");
    return result;
  } else {
    const currentData = data.values[0];
    if (
      Number.isInteger(currentData.value) ||
      typeof currentData.value === "string" ||
      currentData.value instanceof String
    ) {
      /*
      "values": [
        {
          "value": 3
        }
      ]
      */
      result.lifetimeValues.push({
        timeInSeconds: Math.round(new moment().valueOf() / 1000),
        value: [
          {
            key: "value",
            value: currentData.value
          }
        ]
      });
    } else {
      /*
      "values": [
        {
          "value": {
            "like": 3,
            "comment": 3
          }
        }
      ]
      */
      const valueArray = [];
      for (let index in currentData.value) {
        valueArray.push({
          key: index,
          value: currentData.value[index]
        });
      }
      result.lifetimeValues.push({
        timeInSeconds: Math.round(new moment().valueOf() / 1000),
        value: valueArray
      });
    }
    return result;
  }
};

fill_and_save_fb_post_db_object = (analyticsDbObject, data) => {
  for (let i = 0; i < data.length; i++) {
    let analyticObj = data[i];
    const metric_index = analyticsDbObject.analytics.findIndex(
      obj => analyticObj.name === obj.name
    );
    if (metric_index === -1) {
      // metric doesn't exist in db object yet
      analyticsDbObject.analytics.push(process_fb_post_analytics(analyticObj));
    } else {
      // metric already exists in db object so we just need to update it
      analyticsDbObject.analytics[metric_index] = process_fb_post_analytics(
        analyticObj,
        analyticsDbObject.analytics[metric_index]
      );
    }
  }
  analyticsDbObject.save();
};

fill_and_save_fb_page_db_object = (analyticsDbObject, data) => {
  for (let j = 0; j < data.length; j++) {
    let analyticObj = data[j];
    console.log();
    if (analyticObj.period === "day" || analyticObj.period === "lifetime") {
      const metric_index = analyticsDbObject.analytics.findIndex(
        obj => analyticObj.name === obj.name
      );
      if (metric_index === -1) {
        // metric doesn't exist in db object yet
        analyticsDbObject.analytics.push(
          process_fb_page_analytics(analyticObj)
        );
      } else {
        if (metric_index === 23) {
          console.log(
            JSON.stringify(analyticsDbObject.analytics[metric_index])
          );
          console.log("\n\n\n");
        }

        continue;
        if (j === 0) {
          console.log(
            JSON.stringify(analyticsDbObject.analytics[metric_index])
          );
          console.log("\n\n\n");
          console.log(
            JSON.stringify(
              process_fb_page_analytics(
                analyticObj,
                analyticsDbObject.analytics[metric_index]
              )
            )
          );
        }
        // metric already exists in db object so we just need to update it
        analyticsDbObject.analytics[metric_index] = process_fb_page_analytics(
          analyticObj,
          analyticsDbObject.analytics[metric_index]
        );
      }
    }
  }
  if (analyticsDbObject.analytics.length > 1) analyticsDbObject.save();
};

module.exports = {
  requestAllFacebookPostAnalytics: post => {
    // request from FB api then store in our DB

    // need to get the account's access token
    Account.findOne({ socialID: post.accountID }, (err, foundAccount) => {
      if (!err && foundAccount) {
        FB.setAccessToken(foundAccount.accessToken);
        FB.api(post.socialMediaID + fbPostRequest, "get", response => {
          if (post.analyticsID) {
            // post has an analytics object already so need to update it
            Analytics.findOne(
              { associatedID: post.socialMediaID },
              (err, foundPostAnalytics) => {
                if (err || !foundPostAnalytics) {
                  console.log(
                    "post " +
                      post._id +
                      " was unable to find its analytics object with id " +
                      post.analyticsID +
                      " and so is creating a new one."
                  );
                  const analyticsDbObject = new Analytics();
                  post.analyticsID = analyticsDbObject._id;
                  post.save();
                  analyticsDbObject.socialType = "facebook";
                  analyticsDbObject.analyticsType = "post";
                  analyticsDbObject.associatedID = post.socialMediaID;
                  analyticsDbObject.accountName = foundAccount.givenName;
                  analyticsDbObject.postingTimeInSeconds = Math.round(
                    new moment(post.postingDate).valueOf() / 1000
                  );
                  analyticsDbObject.analytics = [];
                  fill_and_save_fb_post_db_object(
                    analyticsDbObject,
                    response.data
                  );
                } else {
                  fill_and_save_fb_post_db_object(
                    foundPostAnalytics,
                    response.data
                  );
                }
              }
            );
          } else {
            // post doesn't have analytics object yet so need to create one
            const analyticsDbObject = new Analytics();
            post.analyticsID = analyticsDbObject._id;
            post.save();
            analyticsDbObject.socialType = "facebook";
            analyticsDbObject.analyticsType = "post";
            analyticsDbObject.associatedID = post.socialMediaID;
            analyticsDbObject.accountName = foundAccount.givenName;
            analyticsDbObject.postingTimeInSeconds = Math.round(
              new moment(post.postingDate).valueOf() / 1000
            );
            analyticsDbObject.analytics = [];
            fill_and_save_fb_post_db_object(analyticsDbObject, response.data);
          }
        });
      } else {
        // err or !foundAccount
        console.log(err);
        console.log(
          "post with id " +
            post._id +
            " was unable to find its account with id " +
            post.accountID +
            " so could not fetch its accessToken and was unable to request its analytics."
        );
      }
    });
  },

  getAllAccountAnalytics: (req, res) => {
    Analytics.findOne(
      { associatedID: req.params.accountSocialID },
      (err, pageAnalyticsObject) => {
        // fetch all analytics objects that belong to one of those accounts
        if (err || !pageAnalyticsObject) {
          console.log(err);
          res.send({
            success: false,
            err,
            message:
              "Unable to find any social accounts associated with this user account."
          });
        } else {
          res.send({ success: true, pageAnalyticsObject });
        }
      }
    );
  },
  getAllPostAnalytics: (req, res) => {
    User.findOne({ _id: req.user._id }, (err, foundUser) => {
      if (!err && foundUser) {
        Analytics.find(
          { analyticsType: "post" },
          (err, postAnalyticsObjects) => {
            if (!err && postAnalyticsObjects) {
              res.send({ success: true, postAnalyticsObjects });
            } else {
              res.send({
                success: false,
                err,
                message: "Unable to find post analytics objects."
              });
            }
          }
        );
      } else {
        res.send({ success: false, message: "Unable to find user.", err });
      }
    });
  },
  requestAllFacebookPageAnalytics: (account, requestString) => {
    FB.setAccessToken(account.accessToken);
    FB.api(account.socialID + requestString, "get", response => {
      if (!response) {
        return console.log(
          "response from facebook = undefined for account " +
            account.givenName +
            " " +
            account._id
        );
      } else if (response.error) {
        console.log(
          "response error for account " + account.givenName + " " + account._id
        );
        console.log(response.error);
        return;
      } else if (!response.data) {
        console.log(
          "response.data from facebook = undefined for account " +
            account.givenName +
            " " +
            account._id
        );
        console.log(response);
        return;
      }
      let analyticsDbObject;

      const createNewAnalytics = () => {
        analyticsDbObject = new Analytics();
        account.analyticsID = analyticsDbObject._id;
        account.save();
        analyticsDbObject.socialType = account.socialType;
        analyticsDbObject.analyticsType = "account";
        analyticsDbObject.associatedID = account.socialID;
        analyticsDbObject.accountName = account.givenName;
        analyticsDbObject.analytics = [];
      };

      if (account.socialID) {
        Analytics.findOne(
          { associatedID: account.socialID },
          (err, foundObj) => {
            if (err || !foundObj) {
              console.log(
                "account.analyticsID exists, but can't find analytics object with that ID in the DB."
              );
              console.log(err);
              createNewAnalytics();
            } else {
              analyticsDbObject = foundObj;

              analyticsDbObject.accountName = account.givenName;
            }

            fill_and_save_fb_page_db_object(analyticsDbObject, response.data);
          }
        );
      } else {
        createNewAnalytics();
        fill_and_save_fb_page_db_object(analyticsDbObject, response.data);
      }
    });
  }
};
