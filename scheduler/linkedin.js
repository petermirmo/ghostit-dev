const functions = require("./functions");
const Post = require("../models/Post");
const Account = require("../models/Account");
const cloudinary = require("cloudinary");
const keys = require("../config/keys");

const Linkedin = require("node-linkedin")(
  keys.linkedinConsumerKey,
  keys.linkedinConsumerSecret,
  keys.linkedinCallbackURL
);
const request = require("request");
const axios = require("axios");

module.exports = {
  postToProfile: post => {
    Account.findOne(
      {
        userID: post.userID,
        socialID: post.accountID
      },
      async (err, account) => {
        if (account) {
          var LI = Linkedin.init(account.accessToken);
          var linkedinPost = {};
          var linkedinLink = {};
          if (post.content !== "") {
            linkedinPost.comment = post.content;
          }
          if (post.link !== "") {
            linkedinLink["submitted-url"] = post.link;
            linkedinPost.content = linkedinLink;
          }
          if (post.linkImage !== "" && post.link !== "") {
            linkedinLink["submitted-image-url"] = post.linkImage;

            linkedinPost.content = linkedinLink;
            if (post.images[0]) {
              linkedinLink["submitted-image-url"] = post.images[0].url;
              linkedinPost.content = linkedinLink;
            }
          }
          linkedinPost.visibility = { code: "anyone" };

          LI.people.share(linkedinPost, (nothing, results) => {
            if (!results) {
              return;
            }

            if (!results.updateKey) {
              functions.savePostError(post._id, results);
            } else {
              functions.savePostSuccessfully(post._id, results.updateKey);
            }
          });
        } else {
          functions.savePostError(post._id, "Cannot find your account!");
        }
      }
    );
  },
  postToPage: post => {
    Account.findOne(
      {
        userID: post.userID,
        socialID: post.accountID
      },
      async (err, account) => {
        if (account) {
          var LI = Linkedin.init(account.accessToken);
          var linkedinPost = {};
          var linkedinLink = {};
          if (post.content !== "") {
            linkedinPost.comment = post.content;
          }
          if (post.link !== "") {
            linkedinLink["submitted-url"] = post.link;
            linkedinPost.content = linkedinLink;
          }
          if (post.linkImage !== "" && post.link !== "") {
            linkedinLink["submitted-image-url"] = post.linkImage;
            linkedinPost.content = linkedinLink;
            if (post.images[0]) {
              linkedinLink["submitted-image-url"] = post.images[0].url;
              linkedinPost.content = linkedinLink;
            }
          }

          linkedinPost.visibility = { code: "anyone" };

          LI.companies.share(
            account.socialID,
            linkedinPost,
            (error, result) => {
              if (!result.updateKey) {
                functions.savePostError(post._id, result);
              } else {
                functions.savePostSuccessfully(post._id, result.updateKey);
              }
            }
          );
        } else {
          functions.savePostError(post._id, "Account not found!");
        }
      }
    );
  }
};
