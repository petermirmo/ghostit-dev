const User = require("../models/User");
const Account = require("../models/Account");
const Post = require("../models/Post");
const FB = require("fb");
const moment = require("moment-timezone");

module.exports = {
  disconnectAccount: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    let { accountID } = req.params;
    //
    Account.findOne({ _id: accountID }, (err, account) => {
      if (err || !account) {
        console.log(err);
        res.send(false);
      } else {
        if (account.userID == String(userID)) {
          account.remove();
          res.send(true);
        } else res.send(false);
      }
    });
  },
  saveAccount: function(req, res) {
    var page = req.body;
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    var newAccount = new Account();
    newAccount.userID = userID;
    newAccount.socialType = page.socialType;
    newAccount.accountType = page.accountType;
    newAccount.accessToken = page.access_token;
    newAccount.socialID = page.id;
    newAccount.givenName = page.name;
    newAccount.category = page.category;
    newAccount.username = page.username;
    newAccount.lastRenewed = new Date().getTime();
    console.log(newAccount);

    newAccount.save().then(result => res.send(true));
  },
  getAccounts: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Account.find({ userID: userID }, function(err, accounts) {
      if (err) {
        console.log(err);
        res.send({ success: false });
        return;
      }
      res.send({ success: true, accounts: accounts });
    });
  },
  getAllFacebookPageAnalytics: function(req, res) {
    console.log("here");
    User.findOne({ _id: req.user._id }, (err, foundUser) => {
      if (!err && foundUser) {
        res.send({ success: true, user: foundUser });
      } else {
        res.send({ success: false, err });
      }
    });
  },
  getPageAnalytics: function(req, res) {
    const { accountID } = req.params;
    Account.findOne({ _id: accountID }, (err, account) => {
      FB.setAccessToken(account.accessToken);
      /*
      507435342791094
      page/post ID/insights?metric=<metric1,metric2,...>&period=<period>&date_preset=<date_preset>
      period=<day / week / days_28 / month / lifetime>
      date_preset=<today / yesterday / last_3d / last_7d / ...>
      https://developers.facebook.com/docs/graph-api/reference/v3.1/insights
      browser interpretter for testing:
      https://developers.facebook.com/tools/explorer/
      */
      FB.api(
        account.socialID +
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
          "&date_preset=last_3d",
        "get",
        function(res) {
          let testArray = res.data;
          if (!testArray || res.error) {
            console.log(res.error);
            return;
          }

          let tempStr = "";

          for (let index = 0; index < testArray.length; index++) {
            let returnObj = testArray[index];
            if (returnObj.period === "day") {
              // handle the day metrics
              tempStr += JSON.stringify(returnObj) + "\n";
            } else if (returnObj.period === "lifetime") {
              // handle the lifetime metric (currently only page_fans)
              tempStr += JSON.stringify(returnObj) + "\n";
            }
          }
          /*
          let dayCount, weekCount, days28Count, noCount, lifetimeCount;
          dayCount = weekCount = days28Count = noCount = lifetimeCount = 0;

          for (let index = 0; index < testArray.length; index++) {
            let testObject = testArray[index];
            if (testObject.period === "day") {
              dayCount++;
            } else if (testObject.period === "week") {
              weekCount++;
            } else if (testObject.period === "days_28") {
              days28Count++;
            } else if (testObject.period === "lifetime") {
              lifetimeCount++;
            } else {
              noCount++;
              console.log(testObject);
            }
          }
          console.log(
            "day:" +
              dayCount +
              "\nweek:" +
              weekCount +
              "\ndays_28:" +
              days28Count +
              "\nlifetime:" +
              lifetimeCount +
              "\nnone:" +
              noCount
          );
          */
        }
      );
    });
    res.send({ success: true });
  },
  getPostAnalytics: function(req, res) {
    const { postID } = req.params;
    Post.findOne({ _id: postID }, (err, post) => {
      Account.findOne({ _id: post.accountID }, (err, account) => {
        let since = new moment("2018-08-01T00:00:00+0000").valueOf() / 1000;
        let until = new moment("2018-08-31T23:59:59+0000").valueOf() / 1000;
        FB.setAccessToken(account.accessToken);
        FB.api(
          post.socialMediaID +
            "/insights?metric=post_activity" +
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
            ",post_video_view_time_by_country_id&since=" +
            since +
            "&until=" +
            until,
          "get",
          function(res) {
            if (res.error || !res.data) {
              console.log("Facebook post analytic error");
              console.log(res);
              return;
            }
            let valuesArray = res.data;

            let dayCount, weekCount, days28Count, noCount;
            dayCount = weekCount = days28Count = noCount = 0;

            for (let index = 0; index < valuesArray.length; index++) {
              let testObject = valuesArray[index];
              if (testObject.period === "day") {
                dayCount++;
              } else if (testObject.period === "week") {
                weekCount++;
              } else if (testObject.period === "days_28") {
                days28Count++;
              } else {
                noCount++;
                console.log(testObject);
              }
            }
            console.log(
              "day:" +
                dayCount +
                "\nweek:" +
                weekCount +
                "\ndays_28:" +
                days28Count +
                "\nnone:" +
                noCount
            );
          }
        );
      });
    });
    res.send({ success: true });
  }
};
