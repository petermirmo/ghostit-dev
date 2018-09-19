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
      let since = new moment().valueOf();
      let until = new moment().valueOf();
      FB.setAccessToken(account.accessToken);
      FB.api(
        account.socialID +
          "/insights?metric=page_content_activity_by_action_type_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_content_activity_by_age_gender_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_content_activity_by_city_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_content_activity_by_country_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_content_activity_by_locale_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_content_activity&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_paid&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_paid_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_organic&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_organic_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_viral&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_viral_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_nonviral&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_nonviral_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_by_city_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_by_country_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_by_locale_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_impressions_by_age_gender_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_engaged_users&since=" +
          since +
          "&until=" +
          until +
          ",page_post_engagements&since=" +
          since +
          "&until=" +
          until +
          ",page_consumptions&since=" +
          since +
          "&until=" +
          until +
          ",page_consumptions_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_consumptions_by_consumption_type&since=" +
          since +
          "&until=" +
          until +
          ",page_consumptions_by_consumption_type_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_places_checkins_by_age_gender&since=" +
          since +
          "&until=" +
          until +
          ",page_places_checkin_total_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_places_checkin_mobile&since=" +
          since +
          "&until=" +
          until +
          ",page_places_checkin_mobile_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_places_checkins_by_age_gender&since=" +
          since +
          "&until=" +
          until +
          ",page_places_checkins_by_locale&since=" +
          since +
          "&until=" +
          until +
          ",page_places_checkins_by_country&since=" +
          since +
          "&until=" +
          until +
          ",page_negative_feedback&since=" +
          since +
          "&until=" +
          until +
          ",page_negative_feedback_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_negative_feedback_by_type&since=" +
          since +
          "&until=" +
          until +
          ",page_negative_feedback_by_type_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_positive_feedback_by_type&since=" +
          since +
          "&until=" +
          until +
          ",page_positive_feedback_by_type_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_fans_online&since=" +
          since +
          "&until=" +
          until +
          ",page_fans_online_per_day&since=" +
          since +
          "&until=" +
          until +
          ",page_fan_adds_by_paid_non_paid_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_actions_post_reactions_like_total&since=" +
          since +
          "&until=" +
          until +
          ",page_actions_post_reactions_love_total&since=" +
          since +
          "&until=" +
          until +
          ",page_actions_post_reactions_wow_total&since=" +
          since +
          "&until=" +
          until +
          ",page_actions_post_reactions_haha_total&since=" +
          since +
          "&until=" +
          until +
          ",page_actions_post_reactions_sorry_total&since=" +
          since +
          "&until=" +
          until +
          ",page_actions_post_reactions_anger_total&since=" +
          since +
          "&until=" +
          until +
          ",page_actions_post_reactions_total&since=" +
          since +
          "&until=" +
          until +
          ",page_total_actions&since=" +
          since +
          "&until=" +
          until +
          ",page_cta_clicks_logged_in_total&since=" +
          since +
          "&until=" +
          until +
          ",page_cta_clicks_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_cta_clicks_by_site_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_cta_clicks_by_age_gender_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_cta_clicks_logged_in_by_country_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_cta_clicks_logged_in_by_city_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_call_phone_clicks_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_call_phone_clicks_by_age_gender_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_call_phone_clicks_logged_in_by_country_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_call_phone_clicks_logged_in_by_city_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_call_phone_clicks_by_site_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_get_directions_clicks_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_get_directions_clicks_by_age_gender_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_get_directions_clicks_logged_in_by_country_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_get_directions_clicks_logged_in_by_city_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_get_directions_clicks_by_site_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",	page_website_clicks_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_website_clicks_by_age_gender_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_website_clicks_logged_in_by_country_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_website_clicks_logged_in_by_city_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_website_clicks_by_site_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",	page_fans&since=" +
          since +
          "&until=" +
          until +
          ",page_fans_locale&since=" +
          since +
          "&until=" +
          until +
          ",page_fans_city&since=" +
          since +
          "&until=" +
          until +
          ",page_fans_country&since=" +
          since +
          "&until=" +
          until +
          ",page_fans_gender_age&since=" +
          since +
          "&until=" +
          until +
          ",page_fan_adds&since=" +
          since +
          "&until=" +
          until +
          ",page_fan_adds_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_fans_by_like_source&since=" +
          since +
          "&until=" +
          until +
          ",page_fans_by_like_source_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_fan_removes&since=" +
          since +
          "&until=" +
          until +
          ",page_fan_removes_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_fans_by_unlike_source_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_views_total&since=" +
          since +
          "&until=" +
          until +
          ",page_views_logout&since=" +
          since +
          "&until=" +
          until +
          ",page_views_logged_in_total&since=" +
          since +
          "&until=" +
          until +
          ",page_views_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_views_external_referrals&since=" +
          since +
          "&until=" +
          until +
          ",page_views_by_profile_tab_total&since=" +
          since +
          "&until=" +
          until +
          ",page_views_by_profile_tab_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_views_by_internal_referer_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_views_by_site_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_views_by_age_gender_logged_in_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_paid&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_organic&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_by_paid_non_paid&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_autoplayed&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_click_to_play&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_video_repeat_views&since=" +
          since +
          "&until=" +
          until +
          ",page_video_complete_views_30s&since=" +
          since +
          "&until=" +
          until +
          ",page_video_complete_views_30s_paid&since=" +
          since +
          "&until=" +
          until +
          ",page_video_complete_views_30s_organic&since=" +
          since +
          "&until=" +
          until +
          ",page_video_complete_views_30s_autoplayed&since=" +
          since +
          "&until=" +
          until +
          ",page_video_complete_views_30s_click_to_play&since=" +
          since +
          "&until=" +
          until +
          ",page_video_complete_views_30s_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_video_complete_views_30s_repeat_views&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_10s&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_10s_paid&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_10s_organic&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_10s_autoplayed&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_10s_click_to_play&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_10s_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_video_views_10s_repeat&since=" +
          since +
          "&until=" +
          until +
          ",page_video_view_time&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_impressions&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_impressions_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_impressions_paid&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_impressions_paid_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_impressions_organic&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_impressions_organic_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_served_impressions_organic_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_impressions_viral&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_impressions_viral_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_impressions_nonviral&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_impressions_nonviral_unique&since=" +
          since +
          "&until=" +
          until +
          ",page_posts_impressions_frequency_distribution&since=" +
          since +
          "&until=" +
          until,
        "get",
        function(res) {
          let testArray = res.data;

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
        let since = new moment().valueOf();
        let until = new moment().valueOf();
        FB.setAccessToken(account.accessToken);
        FB.api(
          post.socialMediaID +
            "/insights?metric=post_activity&since=" +
            since +
            "&until=" +
            until +
            ",post_activity_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_activity_by_action_type&since=" +
            since +
            "&until=" +
            until +
            ",post_activity_by_action_type_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_video_complete_views_30s_autoplayed&since=" +
            since +
            "&until=" +
            until +
            ",post_video_complete_views_30s_clicked_to_play&since=" +
            since +
            "&until=" +
            until +
            ",post_video_complete_views_30s_organic&since=" +
            since +
            "&until=" +
            until +
            ",post_video_complete_views_30s_paid&since=" +
            since +
            "&until=" +
            until +
            ",post_video_complete_views_30s_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_paid&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_paid_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_fan&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_fan_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_fan_paid&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_fan_paid_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_organic&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_organic_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_viral&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_viral_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_nonviral&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_nonviral_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_by_story_type&since=" +
            since +
            "&until=" +
            until +
            ",post_impressions_by_story_type_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_engaged_users&since=" +
            since +
            "&until=" +
            until +
            ",post_negative_feedback&since=" +
            since +
            "&until=" +
            until +
            ",post_negative_feedback_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_negative_feedback_by_type&since=" +
            since +
            "&until=" +
            until +
            ",post_negative_feedback_by_type_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_engaged_fan&since=" +
            since +
            "&until=" +
            until +
            ",post_clicks&since=" +
            since +
            "&until=" +
            until +
            ",post_clicks_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_clicks_by_type&since=" +
            since +
            "&until=" +
            until +
            ",post_clicks_by_type_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_reactions_like_total&since=" +
            since +
            "&until=" +
            until +
            ",post_reactions_love_total&since=" +
            since +
            "&until=" +
            until +
            ",post_reactions_wow_total&since=" +
            since +
            "&until=" +
            until +
            ",post_reactions_haha_total&since=" +
            since +
            "&until=" +
            until +
            ",post_reactions_sorry_total&since=" +
            since +
            "&until=" +
            until +
            ",post_reactions_anger_total&since=" +
            since +
            "&until=" +
            until +
            ",post_reactions_by_type_total&since=" +
            since +
            "&until=" +
            until +
            ",post_video_avg_time_watched&since=" +
            since +
            "&until=" +
            until +
            ",post_video_complete_views_organic&since=" +
            since +
            "&until=" +
            until +
            ",post_video_complete_views_organic_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_video_complete_views_paid&since=" +
            since +
            "&until=" +
            until +
            ",post_video_complete_views_paid_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_video_retention_graph&since=" +
            since +
            "&until=" +
            until +
            ",post_video_retention_graph_clicked_to_play&since=" +
            since +
            "&until=" +
            until +
            ",post_video_retention_graph_autoplayed&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_organic&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_organic_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_paid&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_paid_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_video_length&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_autoplayed&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_clicked_to_play&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_10s&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_10s_unique&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_10s_autoplayed&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_10s_clicked_to_play&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_10s_organic&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_10s_paid&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_10s_sound_on&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_sound_on&since=" +
            since +
            "&until=" +
            until +
            ",post_video_view_time&since=" +
            since +
            "&until=" +
            until +
            ",post_video_view_time_organic&since=" +
            since +
            "&until=" +
            until +
            ",post_video_view_time_by_age_bucket_and_gender&since=" +
            since +
            "&until=" +
            until +
            ",post_video_view_time_by_region_id&since=" +
            since +
            "&until=" +
            until +
            ",post_video_views_by_distribution_type&since=" +
            since +
            "&until=" +
            until +
            ",post_video_view_time_by_distribution_type&since=" +
            since +
            "&until=" +
            until +
            ",post_video_view_time_by_country_id&since=",
          +since + "&until=" + until + "get",
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
