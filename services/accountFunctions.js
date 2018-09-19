const User = require("../models/User");
const Account = require("../models/Account");
const Post = require("../models/Post");
const FB = require("fb");
const moment = require("moment-timezone");

module.exports = {
  disconnectAccount: function(req, res) {
    var account = req.body;

    Account.remove({ _id: account._id }, function(err) {
      if (err) {
        console.log(err);
        res.send(false);
        return;
      }
      res.send(true);
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
    newAccount.lastRenewed = new Date().getTime();

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
  getPageAnalytics: function(req, res) {
    const { accountID } = req.params;
    Account.findOne({ _id: accountID }, (err, account) => {
      let since = new moment("2018-08-01T00:00:00+0000").valueOf() / 1000;
      let until = new moment("2018-08-31T23:59:59+0000").valueOf() / 1000;
      console.log(since);
      console.log(until);
      FB.setAccessToken(account.accessToken);
      FB.api(
        account.socialID +
          "/insights?metric=page_content_activity_by_action_type_unique" +
          ",page_content_activity_by_age_gender_unique" +
          ",page_content_activity_by_city_unique" +
          ",page_content_activity_by_country_unique" +
          ",page_content_activity_by_locale_unique" +
          ",page_content_activity" +
          ",page_impressions" +
          ",page_impressions_unique" +
          ",page_impressions_paid" +
          ",page_impressions_paid_unique" +
          ",page_impressions_organic" +
          ",page_impressions_organic_unique" +
          ",page_impressions_viral" +
          ",page_impressions_viral_unique" +
          ",page_impressions_nonviral" +
          ",page_impressions_nonviral_unique" +
          ",page_impressions_by_city_unique" +
          ",page_impressions_by_country_unique" +
          ",page_impressions_by_locale_unique" +
          ",page_impressions_by_age_gender_unique" +
          ",page_engaged_users" +
          ",page_post_engagements" +
          ",page_consumptions" +
          ",page_consumptions_unique" +
          ",page_consumptions_by_consumption_type" +
          ",page_consumptions_by_consumption_type_unique" +
          ",page_places_checkins_by_age_gender" +
          ",page_places_checkin_total_unique" +
          ",page_places_checkin_mobile" +
          ",page_places_checkin_mobile_unique" +
          ",page_places_checkins_by_age_gender" +
          ",page_places_checkins_by_locale" +
          ",page_places_checkins_by_country" +
          ",page_negative_feedback" +
          ",page_negative_feedback_unique" +
          ",page_negative_feedback_by_type" +
          ",page_negative_feedback_by_type_unique" +
          ",page_positive_feedback_by_type" +
          ",page_positive_feedback_by_type_unique" +
          ",page_fans_online" +
          ",page_fans_online_per_day" +
          ",page_fan_adds_by_paid_non_paid_unique" +
          ",page_actions_post_reactions_like_total" +
          ",page_actions_post_reactions_love_total" +
          ",page_actions_post_reactions_wow_total" +
          ",page_actions_post_reactions_haha_total" +
          ",page_actions_post_reactions_sorry_total" +
          ",page_actions_post_reactions_anger_total" +
          ",page_actions_post_reactions_total" +
          ",page_total_actions" +
          ",page_cta_clicks_logged_in_total" +
          ",page_cta_clicks_logged_in_unique" +
          ",page_cta_clicks_by_site_logged_in_unique" +
          ",page_cta_clicks_by_age_gender_logged_in_unique" +
          ",page_cta_clicks_logged_in_by_country_unique" +
          ",page_cta_clicks_logged_in_by_city_unique" +
          ",page_call_phone_clicks_logged_in_unique" +
          ",page_call_phone_clicks_by_age_gender_logged_in_unique" +
          ",page_call_phone_clicks_logged_in_by_country_unique" +
          ",page_call_phone_clicks_logged_in_by_city_unique" +
          ",page_call_phone_clicks_by_site_logged_in_unique" +
          ",page_get_directions_clicks_logged_in_unique" +
          ",page_get_directions_clicks_by_age_gender_logged_in_unique" +
          ",page_get_directions_clicks_logged_in_by_country_unique" +
          ",page_get_directions_clicks_logged_in_by_city_unique" +
          ",page_get_directions_clicks_by_site_logged_in_unique" +
          ",page_website_clicks_logged_in_unique" +
          ",page_website_clicks_by_age_gender_logged_in_unique" +
          ",page_website_clicks_logged_in_by_country_unique" +
          ",page_website_clicks_logged_in_by_city_unique" +
          ",page_website_clicks_by_site_logged_in_unique" +
          ",page_fans" +
          ",page_fans_locale" +
          ",page_fans_city" +
          ",page_fans_country" +
          ",page_fans_gender_age" +
          ",page_fan_adds" +
          ",page_fan_adds_unique" +
          ",page_fans_by_like_source" +
          ",page_fans_by_like_source_unique" +
          ",page_fan_removes" +
          ",page_fan_removes_unique" +
          ",page_fans_by_unlike_source_unique" +
          ",page_views_total" +
          ",page_views_logout" +
          ",page_views_logged_in_total" +
          ",page_views_logged_in_unique" +
          ",page_views_external_referrals" +
          ",page_views_by_profile_tab_total" +
          ",page_views_by_profile_tab_logged_in_unique" +
          ",page_views_by_internal_referer_logged_in_unique" +
          ",page_views_by_site_logged_in_unique" +
          ",page_views_by_age_gender_logged_in_unique" +
          ",page_video_views" +
          ",page_video_views_paid" +
          ",page_video_views_organic" +
          ",page_video_views_by_paid_non_paid" +
          ",page_video_views_autoplayed" +
          ",page_video_views_click_to_play" +
          ",page_video_views_unique" +
          ",page_video_repeat_views" +
          ",page_video_complete_views_30s" +
          ",page_video_complete_views_30s_paid" +
          ",page_video_complete_views_30s_organic" +
          ",page_video_complete_views_30s_autoplayed" +
          ",page_video_complete_views_30s_click_to_play" +
          ",page_video_complete_views_30s_unique" +
          ",page_video_complete_views_30s_repeat_views" +
          ",page_video_views_10s" +
          ",page_video_views_10s_paid" +
          ",page_video_views_10s_organic" +
          ",page_video_views_10s_autoplayed" +
          ",page_video_views_10s_click_to_play" +
          ",page_video_views_10s_unique" +
          ",page_video_views_10s_repeat" +
          ",page_video_view_time" +
          ",page_posts_impressions" +
          ",page_posts_impressions_unique" +
          ",page_posts_impressions_paid" +
          ",page_posts_impressions_paid_unique" +
          ",page_posts_impressions_organic" +
          ",page_posts_impressions_organic_unique" +
          ",page_posts_served_impressions_organic_unique" +
          ",page_posts_impressions_viral" +
          ",page_posts_impressions_viral_unique" +
          ",page_posts_impressions_nonviral" +
          ",page_posts_impressions_nonviral_unique" +
          ",page_posts_impressions_frequency_distribution&since=" +
          since +
          "&until=" +
          until,
        "get",
        function(res) {
          let testArray = res.data;
          console.log(res);
          if (!testArray) return;

          for (let index = 0; index < testArray.length; index++) {
            let testObject = testArray[index];
            console.log(testObject);
            for (let index2 in testObject.values) {
              let testObjectValue = testObject.values[index2];
              //console.log(testObjectValue);
            }
          }
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

            for (let index = 0; index < valuesArray.length; index++) {
              let testObject = valuesArray[index];
              console.log(testObject);
            }
          }
        );
      });
    });
    res.send({ success: true });
  }
};
