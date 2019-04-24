const { savePostError, savePostSuccessfully } = require("./functions");
const Post = require("../models/Post");
const Account = require("../models/Account");
const cloudinary = require("cloudinary");
const keys = require("../config/keys");

const request = require("request");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const uploadLinkedinFiles = (files, account, callback) => {
  const urnList = [];
  let asyncCounter = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    asyncCounter++;

    console.log(file.url);

    //  "Content-Type": "multipart/form-data"
    // file.url

    //    request(file.url).pipe(fs.createWriteStream("image.jpg"))
    // fs.createReadStream("image.jpg")
    //; boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbTL

    let bodyFormData = new FormData();

    bodyFormData.append("fileupload", request(file.url));

    axios
      .post("https://api.linkedin.com/media/upload", bodyFormData, {
        headers: {
          Authorization: "Bearer " + account.accessToken,
          "Content-Type": "multipart/form-data"
        }
      })
      .then(linkedinImageResult => {
        asyncCounter--;
        console.log("here");

        if (asyncCounter === 0) callback(urnList, account);
        if (linkedinImageResult.data.message) {
          linkedinImageResult.data.message;
        } else {
        }
        console.log(linkedinImageResult.data.message);
        console.log("\n");
      })
      .catch(linkedinImageError => {
        asyncCounter--;
        let errorCatch = linkedinImageError.response;

        if (errorCatch)
          if (linkedinImageError.response.data)
            errorCatch = linkedinImageError.response.data;

        console.log(errorCatch);

        if (asyncCounter === 0) callback(urnList, account);
      });
  }
};
const uploadLinkedinPost = (linkedinPost, account, post) => {
  axios
    .post("https://api.linkedin.com/v2/shares", linkedinPost, {
      headers: {
        Authorization: "Bearer " + account.accessToken
      }
    })
    .then(linkedinPostResult => {
      if (linkedinPostResult.data.message)
        savePostError(post._id, linkedinPostResult.data.message);
      else savePostSuccessfully(linkedinPost._id, linkedinPostResult.data.id);
    })
    .catch(linkedinPostError => {
      let errorCatch = linkedinPostError.response;

      if (errorCatch)
        if (linkedinPostError.response.data)
          errorCatch = linkedinPostError.response.data;

      savePostError(post._id, errorCatch);
    });
};

module.exports = {
  postToLinkedIn: post => {
    Account.findOne(
      {
        socialID: post.accountID
      },
      async (err, account) => {
        if (account) {
          let linkedinPost = {};

          if ((account.accountType = "page"))
            linkedinPost.owner = "urn:li:organization:" + account.socialID;
          else linkedinPost.owner = "urn:li:person:" + account.socialID;

          linkedinPost.distribution = {
            linkedInDistributionTarget: {
              visibleToGuest: true
            }
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
                  resolvedUrl: post.linkImage
                }
              ]
            });

            content = {
              contentEntities,
              title: post.linkTitle,
              description: post.linkDescription
            };

            linkedinPost.content = content;
          }

          if (post.files) {
            uploadLinkedinFiles(post.files, account, urnList => {
              for (let index in urnList) contentEntities.push(urnList[index]);
              content.contentEntities = contentEntities;
              linkedinPost.content = content;

              uploadLinkedinPost(linkedinPost, account, post);
            });
          } else {
            uploadLinkedinPost(linkedinPost, account, post);
          }
        } else {
          savePostError(post._id, "Cannot find your account!");
        }
      }
    );
  }
};
