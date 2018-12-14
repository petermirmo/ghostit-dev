const { savePostError, savePostSuccessfully } = require("./functions");
const Post = require("../models/Post");
const Account = require("../models/Account");
const cloudinary = require("cloudinary");
const keys = require("../config/keys");

const request = require("request");
const axios = require("axios");

module.exports = {
  postToLinkedInProfile: post => {
    Account.findOne(
      {
        socialID: post.accountID
      },
      async (err, account) => {
        if (account) {
          let linkedinPost = {};

          if (post.content !== "") {
            linkedinPost.text = { text: post.content };
          }

          if (post.link !== "") {
            linkedinPost.content = {
              contentEntities: [{ entityLocation: post.link }],
              title: "test title2"
            };
          }
          linkedinPost.owner = "urn:li:person:" + account.socialID;

          axios
            .post("https://api.linkedin.com/v2/shares", linkedinPost, {
              headers: {
                Authorization: "Bearer " + account.accessToken
              }
            })
            .then(linkedinPostResult => {
              if (linkedinPostResult.data.message)
                savePostError(
                  linkedinPostResult._id,
                  linkedinPostResult.data.message
                );
              else savePostSuccessfully(post._id, linkedinPostResult.data.id);
            })
            .catch(linkedinPostError => {
              let errorCatch = linkedinPostError;
              if (linkedinPostError.response) {
                errorCatch = linkedinPostError.response;
                if (linkedinPostError.response.data)
                  errorCatch = linkedinPostError.response.data;
              }
              savePostError(post._id, errorCatch);
            });
        } else {
          savePostError(post._id, "Cannot find your account!");
        }
      }
    );
  },
  postToLinkedInPage: post => {
    Account.findOne(
      {
        userID: post.userID,
        socialID: post.accountID
      },
      async (err, account) => {
        if (account) {
          let linkedinPost = {};
          linkedinPost.author = "urn:li:organization:" + account.socialID;
          linkedinPost.visibility = {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
          };
          linkedinPost.lifecycleState = "PUBLISHED";

          if (post.linkImage !== "" || post.link !== "") {
            linkedinPost.specificContent = {
              "com.linkedin.ugc.ShareContent": {
                primaryLandingPageUrl: post.link,
                shareCommentary: { text: post.content },
                shareMediaCategory: "NONE"
              }
            };
          } else {
            linkedinPost.specificContent = {
              "com.linkedin.ugc.ShareContent": {
                shareCommentary: {
                  text: post.content
                },
                shareMediaCategory: "NONE"
              }
            };
          }

          axios
            .post("https://api.linkedin.com/v2/ugcPosts", linkedinPost, {
              headers: {
                Authorization: "Bearer " + account.accessToken
              }
            })
            .then(linkedinPostResult => {
              if (linkedinPostResult.data.message)
                savePostError(
                  linkedinPostResult._id,
                  linkedinPostResult.data.message
                );
              else savePostSuccessfully(post._id, linkedinPostResult.data.id);
            })
            .catch(linkedinPostError => {
              let errorCatch = linkedinPostError;
              if (linkedinPostError.response) {
                errorCatch = linkedinPostError.response;
                if (linkedinPostError.response.data)
                  errorCatch = linkedinPostError.response.data;
              }
              savePostError(post._id, errorCatch);
            });
        } else {
          savePostError(post._id, "Cannot find your account!");
        }
      }
    );
  }
};
