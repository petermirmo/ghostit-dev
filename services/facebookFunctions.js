const User = require("../models/User");
const Account = require("../models/Account");
const Post = require("../models/Post");
const FB = require("fb");
const generalFunctions = require("./generalFunctions");
const adsSdk = require("facebook-nodejs-business-sdk");
const keys = require("../config/keys");

const {
  getUserID,
  handleDbReqError,
  isProblemWithDbReq,
  isUserAllowedToMakeChange,
  mongoGetErrChecks,
  noObjectFoundError,
  successfulRequest,
  userLacksPermissions
} = require("../util");

const { userNotPermitted } = require("../responseStrings");

module.exports = {
  deletePostFromFacebook: (req, res) => {
    const userID = getUserID(req);

    const { postID } = req.params;

    Post.findOne({ _id: postID }, (err, post) => {
      if (isUserAllowedToMakeChange(userID, post.userID, req.user)) {
        Account.findOne(
          { socialID: post.socialMediaID, userID: post.userID },
          (err, account) => {
            if (isProblemWithDbReq(err)) return handleDbReqError();
            else if (noObjectFound(account))
              return noObjectFoundError("social account");
            else {
              FB.setAccessToken(account.accessToken);

              FB.api(post.socialMediaID, "delete", response => {
                if (isProblemWithDbReq(response)) return handleDbReqError();
                else return successfulRequest();
              });
            }
          }
        );
      } else return userLacksPermissions();
    });
  },
  getFacebookGroups: (req, res) => {
    const userID = getUserID(req);

    // Get facebook profile
    Account.findOne(
      {
        userID: userID,
        socialType: "facebook",
        accountType: "profile"
      },
      (err, account) => {
        if (err) return handleError(err);
        if (account) {
          // Use facebook profile access token to get account groups
          FB.setAccessToken(account.accessToken);

          FB.api("me/groups", "get", results => {
            let groups = results.data;
            console.log(results);

            // Init some values
            for (let index in groups) {
              groups[index].accountType = "group";
              groups[index].socialType = "facebook";
              groups[index].access_token = account.accessToken;
            }
            res.send({ groups });
          });
        } else
          generalFunctions.handleError(res, "Connect Facebook profile first!");
      }
    );
  },
  getFacebookPages: (req, res) => {
    const userID = getUserID(req);
    // Get facebook profile
    Account.findOne(
      {
        userID: userID,
        socialType: "facebook",
        accountType: "profile"
      },
      (err, account) => {
        if (err) generalFunctions.handleError(res, err);
        else if (account) {
          // Use facebook profile access token to get account pages
          FB.setAccessToken(account.accessToken);

          FB.api("me/accounts", "get", results => {
            let pages = results.data;
            // Init some values
            for (let index in pages) {
              pages[index].accountType = "page";
              pages[index].socialType = "facebook";
            }
            res.send({ success: true, pages });
          });
        } else
          generalFunctions.handleError(res, "Connect Facebook profile first!");
      }
    );
  },
  getInstagramPages: (req, res) => {
    const userID = getUserID(req);
    Account.findOne(
      { userID, socialType: "facebook", accountType: "profile" },
      (err, account) => {
        if (err || !account) {
          res.send({
            errorMessage:
              "Connect your Facebook profile first! Facebook authorizes access to Instagram."
          });
        } else {
          FB.setAccessToken(account.accessToken);
          FB.api("me/accounts", "get", results => {
            let facebookPages = results.data;

            if (facebookPages) {
              let pages = [];
              let asyncCounter = 0;
              // Each page the user is an admin of can have a connect Instagram account
              for (let index in facebookPages) {
                const foundFacebookPage = facebookPages[index];
                const accessToken = foundFacebookPage.access_token;

                FB.setAccessToken(accessToken);

                asyncCounter++;
                FB.api(
                  foundFacebookPage.id + "?fields=instagram_business_account",
                  "get",
                  response => {
                    if (response.instagram_business_account) {
                      let instagramObject = response.instagram_business_account;

                      asyncCounter++;

                      FB.api(
                        instagramObject.id + "?fields=username",
                        "get",
                        response2 => {
                          response2.access_token = accessToken;

                          pages.push(response2);
                          asyncCounter--;
                          if (asyncCounter === 0)
                            res.send({
                              success: true,
                              pages
                            });
                        }
                      );
                    }

                    asyncCounter--;
                    if (asyncCounter === 0 && facebookPages.length === 0) {
                      generalFunctions.handleError(
                        res,
                        "Your Facebook page and Instagram pages are not connected."
                      );
                    }
                  }
                );
              }
            } else {
              generalFunctions.handleError(
                res,
                "Your Facebook and Instgram page must be connected to use through the an external software."
              );
            }
          });
        }
      }
    );
  }
};
