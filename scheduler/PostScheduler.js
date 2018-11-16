const Post = require("../models/Post");

let facebook = require("./facebook");
let twitter = require("./twitter");
let linkedin = require("./linkedin");
const generalFunctions = require("../services/generalFunctions");

module.exports = {
  main: function() {
    Post.find({ status: "pending" }).then(result => {
      let postArray = result;
      let currentDate = new Date();

      for (let index in postArray) {
        let post = postArray[index];
        let postingDate = new Date(post.postingDate);
        if (postingDate < currentDate) {
          post.status = "working";
          post.save();
        }
      }

      for (let index in postArray) {
        let post = postArray[index];
        let postingDate = new Date(post.postingDate);
        if (postingDate < currentDate) {
          // Needs to post
          if (post.socialType === "facebook") {
            if (post.accountType === "profile" || post.accountType === "page") {
              facebook.postToProfileOrPage(post);
            } else if (post.accountType === "group") {
              facebook.postToGroup(post);
            } else {
              generalFunctions.handleError(
                res,
                "Facebook accountType is not profile, page or group.",
                post
              );
            }
          } else if (post.socialType === "twitter") {
            if (post.accountType === "profile") {
              twitter.postToProfile(post);
            } else {
              generalFunctions.handleError(
                res,
                "Twitter accountType is not profile",
                post
              );
            }
          } else if (post.socialType === "linkedin") {
            if (post.accountType === "profile") {
              linkedin.postToLinkedInProfile(post);
            } else if (post.accountType === "page") {
              linkedin.postToLinkedInPage(post);
            } else {
              generalFunctions.handleError(
                res,
                "LinkedIn accountType is not profile or page.",
                post
              );
            }
          }
        }
      }
    });
  }
};
