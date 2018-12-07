const Post = require("../models/Post");
const Account = require("../models/Account");
const { savePostError, savePostSuccessfully } = require("./functions");
const keys = require("../config/keys");

const cloudinary = require("cloudinary");
const FB = require("fb");

module.exports = {
  postToProfileOrPage: function(post) {
    Account.findOne(
      {
        socialID: post.accountID
      },
      async function(err, account) {
        if (err) {
          console.log(err);
          savePostError(post._id, err);
          return;
        }
        if (account) {
          // Use facebook profile access token to get account groups
          FB.setAccessToken(account.accessToken);
          if (post.images.length !== 0) {
            var facebookPostWithImage = {};
            // Set non-null information to facebook post
            if (post.content !== "") {
              facebookPostWithImage.caption = post.content;
            }
            for (var i = 0; i < post.images.length; i++) {
              facebookPostWithImage.url = post.images[i].url;
              FB.api("me/photos", "post", facebookPostWithImage, function(res) {
                if (!res || res.error) {
                  savePostError(post._id, res.error);
                } else {
                  savePostSuccessfully(post._id, res.post_id);
                }
              });
            }
          } else {
            var facebookPostNoImage = {};
            // Set non-null information to facebook post
            if (post.content !== "") {
              facebookPostNoImage.message = post.content;
            }
            if (post.link !== "") {
              facebookPostNoImage.link = post.link;
            }
            FB.api("me/feed", "post", facebookPostNoImage, function(res) {
              if (!res || res.error) {
                savePostError(post._id, res.error);
              } else {
                savePostSuccessfully(post._id, res.id);
              }
            });
          }
        } else {
          savePostError(post._id, "Account not found!");
        }
      }
    );
  },
  postToGroup: function(post) {
    Account.findOne(
      {
        userID: post.userID,
        socialID: post.accountID
      },
      async function(err, account) {
        if (err) return console.log(err);
        if (account) {
          // Use facebook profile access token to get account groups
          FB.setAccessToken(account.accessToken);

          if (post.images.length !== 0) {
            var facebookPostWithImage = {};
            // Set non-null information to facebook post
            if (post.content !== "") {
              facebookPostWithImage.message = post.content;
            }
            for (var i = 0; i < post.images.length; i++) {
              facebookPostWithImage.link = post.images[i].url;
              FB.api(
                "/" + account.socialID + "/feed",
                "post",
                facebookPostWithImage,
                function(res) {
                  if (!res || res.error) {
                    savePostError(post._id, res.error);
                  } else {
                    savePostSuccessfully(post._id, res.id);
                  }
                }
              );
            }
          } else {
            var facebookPostNoImage = {};
            // Set non-null information to facebook post
            if (post.content !== "") {
              facebookPostNoImage.message = post.content;
            }
            if (post.link !== "") {
              facebookPostNoImage.link = post.link;
            }
            FB.api(
              "/" + account.socialID + "/feed",
              "post",
              facebookPostNoImage,
              function(res) {
                if (!res || res.error) {
                  savePostError(post._id, res.error);
                } else {
                  savePostSuccessfully(post._id, res.id);
                }
              }
            );
          }
        } else {
          savePostError(post._id, "Account not found!");
        }
      }
    );
  },
  renewAuthToken: function(accounts) {
    let account = accounts[0];
    getFbCode(account, accounts, 0, accessTokenCallback);
  },
  renewPageToken: function(accounts) {
    let account = accounts[0];
    getFbCode(account, accounts, 0, pageTokenCallback);
  }
};
function getFbCode(account, accounts, counter, callback) {
  FB.api(
    "oauth/client_code",
    {
      client_id: keys.fbClientID,
      client_secret: keys.fbClientSecret,
      redirect_uri: keys.fbCallbackUrl,
      access_token: account.accessToken
    },
    function(codeResult) {
      if (!codeResult.code) {
        console.log(codeResult);
        return;
      }
      tradeCodeForToken(codeResult, account, accounts, counter, callback);
    }
  );
}

function tradeCodeForToken(codeResult, account, accounts, counter, callback) {
  FB.api(
    "oauth/access_token",
    {
      client_id: keys.fbClientID,
      redirect_uri: keys.fbCallbackUrl,
      code: codeResult.code
    },
    function(tokenResult) {
      if (!tokenResult.access_token) {
        counter++;

        if (counter < 10) {
          getFbCode(account, accounts, counter, callback);
        } else {
          console.log(tokenResult);
          console.log("failed");
        }
        return undefined;
      } else {
        callback(tokenResult.access_token, accounts);
        return;
      }
    }
  );
}

function pageTokenCallback(accessToken, accounts) {
  if (accessToken) {
    let account = accounts[0];
    FB.setAccessToken(accessToken);

    FB.api("me/accounts", "get", function(result) {
      let pages = result.data;

      for (let index in pages) {
        let page = pages[index];
        if (account.socialID === page.id) {
          for (let i = 0; i < accounts.length; i++) {
            accounts[i].accessToken = page.access_token;
            accounts[i].lastRenewed = new Date();
            accounts[i].save().then(resu => {
              console.log(resu);
              console.log("success");
            });
          }
        }
      }
    });
  }
}
function accessTokenCallback(accessToken, accounts) {
  if (accessToken) {
    for (let i = 0; i < accounts.length; i++) {
      accounts[i].accessToken = accessToken;
      accounts[i].lastRenewed = new Date();
      accounts[i].save().then(resu => {
        console.log(resu);
        console.log("success");
      });
    }
  }
}
