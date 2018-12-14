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
              contentEntities: [
                {
                  entityLocation: post.link,
                  thumbnails: [
                    {
                      resolvedUrl: post.linkImage
                    }
                  ]
                }
              ],
              title: post.linkTitle,
              description: post.linkDescription
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
              let errorCatch = linkedinPostError.response;

              if (errorCatch)
                if (linkedinPostError.response.data)
                  errorCatch = linkedinPostError.response.data;

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
          linkedinPost.distribution = {
            linkedInDistributionTarget: {
              visibleToGuest: true
            }
          };

          if (post.content !== "") {
            linkedinPost.text = { text: post.content };
          }

          if (post.link !== "") {
            linkedinPost.content = {
              contentEntities: [
                {
                  entityLocation: post.link,
                  thumbnails: [
                    {
                      resolvedUrl: post.linkImage
                    }
                  ]
                }
              ],
              title: post.linkTitle,
              description: post.linkDescription
            };
          }
          linkedinPost.owner = "urn:li:organization:" + account.socialID;

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
              let errorCatch = linkedinPostError.response;
              if (errorCatch)
                if (linkedinPostError.response.data)
                  errorCatch = linkedinPostError.response.data;

              savePostError(post._id, errorCatch);
            });
        } else {
          savePostError(post._id, "Cannot find your account!");
        }
      }
    );
  }
};
