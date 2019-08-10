const moment = require("moment-timezone");
const Post = require("../models/Post");

const {
  requestAllFacebookPostAnalytics
} = require("../services/analyticsFunctions");

module.exports = {
  main: () => {
    Post.find(
      { socialType: "facebook", accountType: "page", status: "posted" },
      (err, foundPosts) => {
        if (!err && foundPosts) {
          for (let i = 0; i < foundPosts.length; i++) {
            const post = foundPosts[i];

            if (post.socialMediaID) {
              if (
                post.analyticsID &&
                new moment(post.postingDate).add(28, "days") < new moment()
              ) {
                // post is over 4 weeks old and already has an analytics object so dont bother updating it
                // if it is over 4 weeks old and doesn't have an analytics object, we should request its analytics
                // just once to get its lifetime values
                continue;
              } else {
                requestAllFacebookPostAnalytics(post);
              }
            }
          }
        }
      }
    );
  }
};
