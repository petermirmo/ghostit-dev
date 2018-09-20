const User = require("../models/User");
const Account = require("../models/Account");
let FB = require("fb");

module.exports = {
  getFacebookGroups: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    // Get facebook profile
    Account.findOne(
      {
        userID: userID,
        socialType: "facebook",
        accountType: "profile"
      },
      function(err, account) {
        if (err) return handleError(err);
        if (account) {
          // Use facebook profile access token to get account groups
          FB.setAccessToken(account.accessToken);

          FB.api("me/groups", "get", function(results) {
            let groups = results.data;

            // Init some values
            for (let index in groups) {
              groups[index].accountType = "group";
              groups[index].socialType = "facebook";
              groups[index].access_token = account.accessToken;
            }
            res.send({ groups });
          });
        } else {
          res.send({
            success: false,
            errorMessage: "Connect Facebook profile first!"
          });
        }
      }
    );
  },
  getFacebookPages: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    // Get facebook profile
    Account.findOne(
      {
        userID: userID,
        socialType: "facebook",
        accountType: "profile"
      },
      function(err, account) {
        if (err) return handleError(err);
        if (account) {
          // Use facebook profile access token to get account pages
          FB.setAccessToken(account.accessToken);

          FB.api("me/accounts", "get", function(results) {
            let pages = results.data;
            // Init some values
            for (let index in pages) {
              pages[index].accountType = "page";
              pages[index].socialType = "facebook";
            }
            res.send({ success: true, pages });
          });
        } else {
          res.send({
            success: false,
            errorMessage: "Connect Facebook profile first!"
          });
        }
      }
    );
  },
  getInstagramPages: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
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
                let foundFacebookPage = facebookPages[index];

                FB.setAccessToken(foundFacebookPage.access_token);

                asyncCounter++;
                FB.api(
                  foundFacebookPage.id + "?fields=instagram_accounts",
                  "get",
                  response => {
                    if (response.instagram_accounts) {
                      if (response.instagram_accounts.data) {
                        let instagramArray = response.instagram_accounts.data;

                        for (let index3 in instagramArray) {
                          let instagramObject = instagramArray[index3];
                          asyncCounter++;

                          FB.api(
                            instagramObject.id +
                              "?fields=username,access_token",
                            "get",
                            response2 => {
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
                      }
                    }

                    asyncCounter--;
                    if (asyncCounter === 0 && facebookPages.length === 0) {
                      res.send({
                        success: false,
                        errorMessage:
                          "Your Facebook page and Instagram pages are not connected."
                      });
                    }
                  }
                );
              }
            } else {
              res.send({
                errorMessage:
                  "Your Facebook and Instgram page must be connected to use through the an external software."
              });
            }
          });
        }
      }
    );
  }
};
