const { savePostError, savePostSuccessfully } = require("./functions");
const Post = require("../models/Post");
const Account = require("../models/Account");
const cloudinary = require("cloudinary");
const keys = require("../config/keys");

const request = require("request");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { whatFileTypeIsString, isUrlImage, isUrlVideo } = require("../util");

const ImagePost = (postdata, account, post) => {
  console.log(postdata);
  axios
    .post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      postdata,
      {
        headers: {
          Authorization: "Bearer " + account.accessToken,
          "Content-Type": "application/json",
        },
      }
    )
    .then((linkedinImageResult) => {
      for (let i = 0; i < post.files.length; i++) {
        const file = post.files[i].url;

        const uploadUrl =
          linkedinImageResult.data.value.uploadMechanism[
            "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
          ]["uploadUrl"];
        const header =
          linkedinImageResult.data.value.uploadMechanism[
            "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
          ]["headers"]["media-type-family"];
        const asset_urn = linkedinImageResult.data.value.asset;
        request(file)
          .pipe(fs.createWriteStream("image.jpg"))
          .on("finish", (data) => {
            const stream = fs.createReadStream("image.jpg");
            var formdata = new FormData();
            formdata.append("file", stream);
            request(
              {
                headers: {
                  Authorization: "Bearer " + account.accessToken,
                  "media-type-family": header,
                },
                uri: uploadUrl,
                body: stream,
                method: "POST",
              },
              (error, res, body) => {}
            );
            const post_data = {
              content: {
                contentEntities: [
                  {
                    entity: "" + asset_urn,
                  },
                ],
                description: "Test Description " + post.content,
                title: "Test Share with Title",
                shareMediaCategory: "IMAGE",
              },
              distribution: {
                linkedInDistributionTarget: {},
              },

              subject: "Test Share Subject",
              text: {
                text: post.content,
              },
            };
            if (account.accountType === "page")
              post_data.owner = "urn:li:organization:" + account.socialID;
            else post_data.owner = "urn:li:person:" + account.socialID;
            axios
              .post("https://api.linkedin.com/v2/shares", post_data, {
                headers: {
                  Authorization: "Bearer " + account.accessToken,
                  "Content-Type": "application/json",
                },
              })
              .then((linkedinPostResult) => {
                if (linkedinPostResult.data.message)
                  savePostError(post._id, linkedinPostResult.data.message);
                else savePostSuccessfully(post._id, linkedinPostResult.data.id);
              })
              .catch((linkedinPostError) => {
                let errorCatch = linkedinPostError.response;

                if (errorCatch)
                  if (linkedinPostError.response.data)
                    errorCatch = linkedinPostError.response.data;

                savePostError(post._id, errorCatch);
              });
            try {
              fs.unlinkSync("image.jpg");
            } catch (e) {
              console.log(e);
            }
          });
      }
    })
    .catch((error) => {});
};

const uploadLinkedinPost = (linkedinPost, account, post) => {
  axios
    .post("https://api.linkedin.com/v2/shares", linkedinPost, {
      headers: {
        Authorization: "Bearer " + account.accessToken,
      },
    })
    .then((linkedinPostResult) => {
      if (linkedinPostResult.data.message)
        savePostError(post._id, linkedinPostResult.data.message);
      else savePostSuccessfully(post._id, linkedinPostResult.data.id);
    })
    .catch((linkedinPostError) => {
      let errorCatch = linkedinPostError.response;

      if (errorCatch)
        if (linkedinPostError.response.data)
          errorCatch = linkedinPostError.response.data;

      savePostError(post._id, errorCatch);
    });
};

module.exports = {
  postToLinkedIn: (post) => {
    Account.findOne(
      {
        socialID: post.accountID,
      },
      async (err, account) => {
        if (account) {
          let linkedinPost = {};

          if (account.accountType === "page")
            linkedinPost.owner = "urn:li:organization:" + account.socialID;
          else linkedinPost.owner = "urn:li:person:" + account.socialID;

          linkedinPost.distribution = {
            linkedInDistributionTarget: {
              visibleToGuest: true,
            },
          };

          if (post.content !== "") {
            linkedinPost.text = { text: post.content };
          }
          const contentEntities = [];
          let content = {};

          if (post.link) {
            contentEntities.push({
              entityLocation: post.link,
              thumbnails: [
                {
                  resolvedUrl: post.linkImage,
                },
              ],
            });

            content = {
              contentEntities,
              title: post.linkTitle,
              description: post.linkDescription,
            };

            linkedinPost.content = content;
          }

          if (post.files && post.files.length > 0) {
            for (let i = 0; i < post.files.length; i++) {
              const file = post.files[i];
              if (isUrlVideo(file.url)) {
                let linkedinPost = {
                  registerUploadRequest: {},
                };
                if (account.accountType === "page")
                  linkedinPost.registerUploadRequest.owner =
                    "urn:li:organization:" + account.socialID;
                else
                  linkedinPost.registerUploadRequest.owner =
                    "urn:li:person:" + account.socialID;
                linkedinPost.registerUploadRequest.recipes = [
                  "urn:li:digitalmediaRecipe:feedshare-video",
                ];
                linkedinPost.registerUploadRequest.serviceRelationships = [
                  {
                    identifier: "urn:li:userGeneratedContent",
                    relationshipType: "OWNER",
                  },
                ];
              } else {
                let linkedinPost = {
                  registerUploadRequest: {},
                };
                if (account.accountType === "page")
                  linkedinPost.registerUploadRequest.owner =
                    "urn:li:organization:" + account.socialID;
                else
                  linkedinPost.registerUploadRequest.owner =
                    "urn:li:person:" + account.socialID;
                linkedinPost.registerUploadRequest.recipes = [
                  "urn:li:digitalmediaRecipe:feedshare-image",
                ];
                linkedinPost.registerUploadRequest.serviceRelationships = [
                  {
                    identifier: "urn:li:userGeneratedContent",
                    relationshipType: "OWNER",
                  },
                ];

                ImagePost(linkedinPost, account, post);
              }
            }
          } else uploadLinkedinPost(linkedinPost, account, post);
        } else {
          savePostError(post._id, "Cannot find your account!");
        }
      }
    );
  },
};

/*if (post.files) {
  uploadLinkedinFiles(post.files, account, urnList => {
    for (let index in urnList) contentEntities.push(urnList[index]);
    content.contentEntities = contentEntities;
    linkedinPost.content = content;

    uploadLinkedinPost(linkedinPost, account, post);
  });
} else {*/

//}
