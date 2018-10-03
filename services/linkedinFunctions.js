const User = require("../models/User");
const Account = require("../models/Account");
const keys = require("../config/keys");
const generalFunctions = require("./generalFunctions");

var Linkedin = require("node-linkedin")(
  keys.linkedinConsumerKey,
  keys.linkedinConsumerSecret,
  keys.linkedinCallbackURL
);
module.exports = {
  getLinkedinPages: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    // Get Linkedin profile
    Account.findOne(
      {
        userID: userID,
        socialType: "linkedin",
        accountType: "profile"
      },
      function(err, account) {
        if (err) generalFunctions.handleError(res, err);

        if (account) {
          // Use Linkedin profile access token to get account pages
          let LI = Linkedin.init(account.accessToken);

          // Get all companies that the user is an admin of
          LI.companies.asAdmin(function(err, results) {
            let companies = results.values;
            if (err) return handleError(err);
            // Linkedin groups (companies) do not come with access tokens so we will use the
            // user's profile access token
            // We also want to set accountType and socialType
            for (let index in companies) {
              companies[index].accountType = "page";
              companies[index].socialType = "linkedin";
              companies[index].access_token = account.accessToken;
            }
            res.send({ success: true, pages: companies });
          });
        } else {
          generalFunctions.handleError(res, "No account found");
        }
      }
    );
  },
  getLinkedinCode: function(req, res) {
    // Get code from Linkedin to trade for access code
    var scope = [
      "r_basicprofile",
      "r_emailaddress",
      "rw_company_admin",
      "w_share"
    ];

    Linkedin.auth.authorize(res, scope);
  },
  getLinkedinAccessToken: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    // Get access token from Linkedin
    Linkedin.auth.getAccessToken(
      res,
      req.query.code,
      req.query.state,
      (err, results) => {
        if (err) generalFunctions.handleError(res, err);
        else {
          let accessToken = results.access_token;

          // User access token to get profile information
          let LI = Linkedin.init(accessToken);

          LI.people.me(function(err, $in) {
            if (err) res.send(false);
            let linkedinProfile = $in;

            Account.findOne(
              { userID, socialID: linkedinProfile.id },
              (err, account) => {
                if (!account) {
                  let newAccount = new Account();

                  newAccount.userID = userID;
                  newAccount.socialType = "linkedin";
                  newAccount.accountType = "profile";
                  newAccount.accessToken = accessToken;
                  newAccount.socialID = linkedinProfile.id;
                  newAccount.givenName = linkedinProfile.firstName;
                  newAccount.familyName = linkedinProfile.lastName;
                  newAccount.email = linkedinProfile.emailAddress;

                  newAccount.save((err, result) => {
                    if (err) generalFunctions.handleError(res, err);
                    else res.redirect("/social-accounts");
                  });
                } else if (account) {
                  account.accessToken = accessToken;
                  account.save((err, result) => {
                    res.redirect("/social-accounts");
                  });
                } else res.redirect("/social-accounts");
              }
            );
          });
        }
      }
    );
  }
};
