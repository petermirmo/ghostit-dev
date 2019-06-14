const User = require("../models/User");
const Analytics = require("../models/Analytics");
const Account = require("../models/Account");
const Post = require("../models/Post");
const FB = require("fb");
const moment = require("moment-timezone");
const generalFunctions = require("./generalFunctions");

const { getUserID } = require("../util");

const fbAccountRequest =
  "/insights?metric=" +
  "page_content_activity_by_action_type_unique" + // all 3
  ",page_content_activity_by_age_gender_unique" + // none
  ",page_content_activity_by_city_unique" + // none
  ",page_content_activity_by_country_unique" + // none
  ",page_content_activity_by_locale_unique" + // none
  ",page_content_activity" + // all 3
  ",page_impressions" + // all 3
  ",page_impressions_unique" + // all 3
  ",page_impressions_paid" + // all 3
  ",page_impressions_paid_unique" + // all 3
  ",page_impressions_organic" + // all 3
  ",page_impressions_organic_unique" + // all 3
  ",page_impressions_viral" + // all 3
  ",page_impressions_viral_unique" + // all 3
  ",page_impressions_nonviral" + // all 3
  ",page_impressions_nonviral_unique" + // all 3
  ",page_impressions_by_city_unique" + // none
  ",page_impressions_by_country_unique" + // none
  ",page_impressions_by_locale_unique" + // none
  ",page_impressions_by_age_gender_unique" + // none
  ",page_engaged_users" + // all 3
  ",page_post_engagements" + // all 3
  ",page_consumptions" + // all 3
  ",page_consumptions_unique" + // all 3
  ",page_consumptions_by_consumption_type" + // all 3
  ",page_consumptions_by_consumption_type_unique" + // all 3
  ",page_places_checkins_by_age_gender" + // none
  ",page_places_checkin_total_unique" + // all 3
  ",page_places_checkin_mobile" + // all 3
  ",page_places_checkin_mobile_unique" + // all 3
  ",page_places_checkins_by_age_gender" + // none
  ",page_places_checkins_by_locale" + // none
  ",page_places_checkins_by_country" + // none
  ",page_negative_feedback" + // all 3
  ",page_negative_feedback_unique" + // all 3
  ",page_negative_feedback_by_type" + // all 3
  ",page_negative_feedback_by_type_unique" + // all 3
  ",page_positive_feedback_by_type" + // all 3
  ",page_positive_feedback_by_type_unique" + // all 3
  ",page_fans_online" + // day
  ",page_fans_online_per_day" + // none
  ",page_fan_adds_by_paid_non_paid_unique" + // day
  ",page_actions_post_reactions_like_total" + // all 3
  ",page_actions_post_reactions_love_total" + // all 3
  ",page_actions_post_reactions_wow_total" + // all 3
  ",page_actions_post_reactions_haha_total" + // all 3
  ",page_actions_post_reactions_sorry_total" + // all 3
  ",page_actions_post_reactions_anger_total" + // all 3
  ",page_actions_post_reactions_total" + // day
  ",page_total_actions" + // all 3
  ",page_cta_clicks_logged_in_total" + // all 3
  ",page_cta_clicks_logged_in_unique" + // all 3
  ",page_cta_clicks_by_site_logged_in_unique" + // all 3
  ",page_cta_clicks_by_age_gender_logged_in_unique" + // none
  ",page_cta_clicks_logged_in_by_country_unique" + // none
  ",page_cta_clicks_logged_in_by_city_unique" + // none
  ",page_call_phone_clicks_logged_in_unique" + // all 3
  ",page_call_phone_clicks_by_age_gender_logged_in_unique" + // none
  ",page_call_phone_clicks_logged_in_by_country_unique" + // none
  ",page_call_phone_clicks_logged_in_by_city_unique" + // none
  ",page_call_phone_clicks_by_site_logged_in_unique" + // all 3
  ",page_get_directions_clicks_logged_in_unique" + // all 3
  ",page_get_directions_clicks_by_age_gender_logged_in_unique" + // none
  ",page_get_directions_clicks_logged_in_by_country_unique" + // none
  ",page_get_directions_clicks_logged_in_by_city_unique" + // none
  ",page_get_directions_clicks_by_site_logged_in_unique" + // all 3
  ",page_website_clicks_logged_in_unique" + // all 3
  ",page_website_clicks_by_age_gender_logged_in_unique" + // none
  ",page_website_clicks_logged_in_by_country_unique" + // none
  ",page_website_clicks_logged_in_by_city_unique" + // none
  ",page_website_clicks_by_site_logged_in_unique" + // all 3
  ",page_fans" + // lifetime
  ",page_fans_locale" + // none
  ",page_fans_city" + // none
  ",page_fans_country" + // none
  ",page_fans_gender_age" + // none
  ",page_fan_adds" + // day
  ",page_fan_adds_unique" + // all 3
  ",page_fans_by_like_source" + // day
  ",page_fans_by_like_source_unique" + // day
  ",page_fan_removes" + // day
  ",page_fan_removes_unique" + // all 3
  ",page_fans_by_unlike_source_unique" + // day
  ",page_views_total" + // all 3
  ",page_views_logout" + // none
  ",page_views_logged_in_total" + // all 3
  ",page_views_logged_in_unique" + // all 3
  ",page_views_external_referrals" + // day
  ",page_views_by_profile_tab_total" + // all 3
  ",page_views_by_profile_tab_logged_in_unique" + // all 3
  ",page_views_by_internal_referer_logged_in_unique" + // all 3
  ",page_views_by_site_logged_in_unique" + // all 3
  ",page_views_by_age_gender_logged_in_unique" + // none
  ",page_video_views" + // all 3
  ",page_video_views_paid" + // all 3
  ",page_video_views_organic" + // all 3
  ",page_video_views_by_paid_non_paid" + // all 3
  ",page_video_views_autoplayed" + // all 3
  ",page_video_views_click_to_play" + // all 3
  ",page_video_views_unique" + // all 3
  ",page_video_repeat_views" + // all 3
  ",page_video_complete_views_30s" + // all 3
  ",page_video_complete_views_30s_paid" + // all 3
  ",page_video_complete_views_30s_organic" + // all 3
  ",page_video_complete_views_30s_autoplayed" + // all 3
  ",page_video_complete_views_30s_click_to_play" + // all 3
  ",page_video_complete_views_30s_unique" + // all 3
  ",page_video_complete_views_30s_repeat_views" + // all 3
  ",page_video_views_10s" + // all 3
  ",page_video_views_10s_paid" + // all 3
  ",page_video_views_10s_organic" + // all 3
  ",page_video_views_10s_autoplayed" + // all 3
  ",page_video_views_10s_click_to_play" + // all 3
  ",page_video_views_10s_unique" + // all 3
  ",page_video_views_10s_repeat" + // all 3
  ",page_video_view_time" + // day
  ",page_posts_impressions" + // all 3
  ",page_posts_impressions_unique" + // all 3
  ",page_posts_impressions_paid" + // all 3
  ",page_posts_impressions_paid_unique" + // all 3
  ",page_posts_impressions_organic" + // all 3
  ",page_posts_impressions_organic_unique" + // all 3
  ",page_posts_served_impressions_organic_unique" + // all 3
  ",page_posts_impressions_viral" + // all 3
  ",page_posts_impressions_viral_unique" + // all 3
  ",page_posts_impressions_nonviral" + // all 3
  ",page_posts_impressions_nonviral_unique" + // all 3
  ",page_posts_impressions_frequency_distribution" + // all 3
  "&date_preset=last_90d";

const fbPostRequest =
  "/insights?metric=" +
  ",post_activity" +
  ",post_activity_unique" +
  ",post_activity_by_action_type" +
  ",post_activity_by_action_type_unique" +
  ",post_video_complete_views_30s_autoplayed" +
  ",post_video_complete_views_30s_clicked_to_play" +
  ",post_video_complete_views_30s_organic" +
  ",post_video_complete_views_30s_paid" +
  ",post_video_complete_views_30s_unique" +
  ",post_impressions" +
  ",post_impressions_unique" +
  ",post_impressions_paid" +
  ",post_impressions_paid_unique" +
  ",post_impressions_fan" +
  ",post_impressions_fan_unique" +
  ",post_impressions_fan_paid" +
  ",post_impressions_fan_paid_unique" +
  ",post_impressions_organic" +
  ",post_impressions_organic_unique" +
  ",post_impressions_viral" +
  ",post_impressions_viral_unique" +
  ",post_impressions_nonviral" +
  ",post_impressions_nonviral_unique" +
  ",post_impressions_by_story_type" +
  ",post_impressions_by_story_type_unique" +
  ",post_engaged_users" +
  ",post_negative_feedback" +
  ",post_negative_feedback_unique" +
  ",post_negative_feedback_by_type" +
  ",post_negative_feedback_by_type_unique" +
  ",post_engaged_fan" +
  ",post_clicks" +
  ",post_clicks_unique" +
  ",post_clicks_by_type" +
  ",post_clicks_by_type_unique" +
  ",post_reactions_like_total" +
  ",post_reactions_love_total" +
  ",post_reactions_wow_total" +
  ",post_reactions_haha_total" +
  ",post_reactions_sorry_total" +
  ",post_reactions_anger_total" +
  ",post_reactions_by_type_total" +
  ",post_video_avg_time_watched" +
  ",post_video_complete_views_organic" +
  ",post_video_complete_views_organic_unique" +
  ",post_video_complete_views_paid" +
  ",post_video_complete_views_paid_unique" +
  ",post_video_retention_graph" +
  ",post_video_retention_graph_clicked_to_play" +
  ",post_video_retention_graph_autoplayed" +
  ",post_video_views_organic" +
  ",post_video_views_organic_unique" +
  ",post_video_views_paid" +
  ",post_video_views_paid_unique" +
  ",post_video_length" +
  ",post_video_views" +
  ",post_video_views_unique" +
  ",post_video_views_autoplayed" +
  ",post_video_views_clicked_to_play" +
  ",post_video_views_10s" +
  ",post_video_views_10s_unique" +
  ",post_video_views_10s_autoplayed" +
  ",post_video_views_10s_clicked_to_play" +
  ",post_video_views_10s_organic" +
  ",post_video_views_10s_paid" +
  ",post_video_views_10s_sound_on" +
  ",post_video_views_sound_on" +
  ",post_video_view_time" +
  ",post_video_view_time_organic" +
  ",post_video_view_time_by_age_bucket_and_gender" +
  ",post_video_view_time_by_region_id" +
  ",post_video_views_by_distribution_type" +
  ",post_video_view_time_by_distribution_type" +
  ",post_video_view_time_by_country_id" +
  "&period=lifetime";

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
        // metric already exists in db object so we just need to update it
        analyticsDbObject.analytics[metric_index] = process_fb_page_analytics(
          analyticObj,
          analyticsDbObject.analytics[metric_index]
        );
      }
    }
  }
  analyticsDbObject.save();
};

module.exports = {
  requestAllFacebookPostAnalytics: (req, res) => {
    // request from FB api then store in our DB
    User.findOne({ _id: req.user._id }, (err, foundUser) => {
      if (!err && foundUser) {
        if (foundUser.role === "admin") {
          Post.find(
            { socialType: "facebook", accountType: "page", status: "posted" },
            (err, foundPosts) => {
              if (!err && foundPosts) {
                for (let i = 0; i < foundPosts.length; i++) {
                  const post = foundPosts[i];
                  if (post.socialMediaID) {
                    if (
                      post.analyticsID &&
                      new moment(post.postingDate).add(28, "days") <
                        new moment()
                    ) {
                      // post is over 4 weeks old and already has an analytics object so dont bother updating it
                      // if it is over 4 weeks old and doesn't have an analytics object, we should request its analytics
                      // just once to get its lifetime values
                      continue;
                    }
                    // need to get the account's access token
                    Account.findOne(
                      { _id: post.accountID },
                      (err, foundAccount) => {
                        if (!err && foundAccount) {
                          FB.setAccessToken(foundAccount.accessToken);
                          FB.api(
                            post.socialMediaID + fbPostRequest,
                            "get",
                            function(response) {
                              if (post.analyticsID) {
                                // post has an analytics object already so need to update it
                                Analytics.findOne(
                                  { _id: post.analyticsID },
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
                                      analyticsDbObject.associatedID = post._id;
                                      analyticsDbObject.accountName =
                                        foundAccount.givenName;
                                      analyticsDbObject.postingTimeInSeconds = Math.round(
                                        new moment(post.postingDate).valueOf() /
                                          1000
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
                                analyticsDbObject.associatedID = post._id;
                                analyticsDbObject.accountName =
                                  foundAccount.givenName;
                                analyticsDbObject.postingTimeInSeconds = Math.round(
                                  new moment(post.postingDate).valueOf() / 1000
                                );
                                analyticsDbObject.analytics = [];
                                fill_and_save_fb_post_db_object(
                                  analyticsDbObject,
                                  response.data
                                );
                              }
                            }
                          );
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
                      }
                    );
                  }
                }
                // for each post loop ends here
                res.send({ success: true });
              } else {
                console.log(err);
                console.log(
                  "Post.find returned err or !foundPosts. err logged above."
                );
                res.send({ success: false, err });
              }
            }
          );
        } else {
          console.log("User requesting all post analytics is not an admin.");
          res.send({
            success: false,
            message: "Only admins can request all post analytics."
          });
        }
      } else {
        // User.findOne returned err or !foundUser
        console.log(err);
        console.log(
          "User.findOne returned err or !foundUser. err logged above"
        );
        res.send({ success: false, err });
      }
    });
  },

  getAllAccountAnalytics: (req, res) => {
    const userID = getUserID(req);

    // get from our DB
    Account.find(
      { userID, analyticsID: { $ne: null } },
      (err, foundAccounts) => {
        // fetch all social account that are 'owned' with this user
        if (err || !foundAccounts) {
          return generalFunctions.handleError(
            res,
            err,
            undefined,
            "Unable to find any social accounts associated with this user account."
          );
        }

        // make an array to be used with an 'or' operator for the analytics object request
        const analyticsIDList = foundAccounts.map(obj => {
          return { _id: obj.analyticsID };
        });

        if (analyticsIDList.length !== 0) {
          Analytics.find({ $or: analyticsIDList }, (err, analyticsObjects) => {
            // fetch all analytics objects that belong to one of those accounts
            if (err || !analyticsObjects) {
              console.log(err);
              res.send({
                success: false,
                err,
                message:
                  "Unable to find any social accounts associated with this user account."
              });
            } else {
              res.send({ success: true, analyticsObjects });
            }
          });
        } else {
          return generalFunctions.handleError(
            res,
            "Unable to find any social accounts associated with this user account."
          );
        }
      }
    );
  },
  getAllPostAnalytics: (req, res) => {
    User.findOne({ _id: req.user._id }, (err, foundUser) => {
      if (!err && foundUser) {
        if (foundUser.role !== "admin") {
          res.send({ success: false, message: "User is not admin." });
        } else {
          Analytics.find({ analyticsType: "post" }, (err, foundAnalytics) => {
            if (!err && foundAnalytics) {
              res.send({ success: true, analyticsObjects: foundAnalytics });
            } else {
              res.send({
                success: false,
                err,
                message: "Unable to find post analytics objects."
              });
            }
          });
        }
      } else {
        res.send({ success: false, message: "Unable to find user.", err });
      }
    });
  },
  requestAllFacebookPageAnalytics: account => {
    FB.setAccessToken(account.accessToken);
    FB.api(account.socialID + fbAccountRequest, "get", response => {
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
        analyticsDbObject.socialType = "facebook";
        analyticsDbObject.analyticsType = "account";
        analyticsDbObject.associatedID = account._id;
        analyticsDbObject.accountName = account.givenName;
        analyticsDbObject.analytics = [];
      };

      if (account.analyticsID) {
        Analytics.findOne({ _id: account.analyticsID }, (err, foundObj) => {
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
        });
      } else {
        createNewAnalytics();
        fill_and_save_fb_page_db_object(analyticsDbObject, response.data);
      }
    });
  }
};
