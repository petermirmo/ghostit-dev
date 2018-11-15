const User = require("../models/User");
const Account = require("../models/Account");
const keys = require("../config/keys");
const generalFunctions = require("./generalFunctions");
const axios = require("axios");
var http = require("http");
var querystring = require("querystring");

module.exports = {
  getLinkedinPages: (req, res) => {
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
      (err, account) => {
        if (err) generalFunctions.handleError(res, err);

        if (account) {
          // Use Linkedin profile access token to get account pages
          let LI = Linkedin.init(account.accessToken);

          // Get all companies that the user is an admin of
          LI.companies.asAdmin((err, results) => {
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
  getLinkedinCode: (req, res) => {
    // Get code from Linkedin to trade for access code
    res.redirect(
      "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=" +
        keys.linkedinConsumerKey +
        "&redirect_uri=" +
        keys.linkedinCallbackURL +
        "&state=" +
        keys.linkedinState +
        "&scope=r_ads%20r_basicprofile%20r_emailaddress%20rw_company_admin%20w_organization_social%20r_ads_reporting%20r_organization_social%20rw_organization_admin%20w_share%20r_basicprofile%20rw_ads%20w_member_social"
    );
  },
  getLinkedinAccessToken: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    // Get access token from Linkedin
    var post_data = querystring.stringify({
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: keys.linkedinCallbackURL,
      client_id: keys.linkedinConsumerKey,
      client_secret: keys.linkedinConsumerSecret
    });

    // Set up the request
    var post_req = http.request(
      {
        host: "www.linkedin.com",
        port: "80",
        path: "/oauth/v2/accessToken",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(post_data)
        }
      },
      linkedinResponse => {
        linkedinResponse.setEncoding("utf8");
        linkedinResponse.on("data", data => {
          console.log("Response: " + data);
          /*

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
          );*/
        });
      }
    );
    post_req.write(post_data);
    post_req.end();

    res.send(true);

    /*

    if (req.query.state == keys.linkedinState && req.query.code) {
      console.log(req.query);
      axios
        .post(
          "https://www.linkedin.com/oauth/v2/accessToken",
          {
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: keys.linkedinCallbackURL,
            client_id: keys.linkedinConsumerKey,
            client_secret: keys.linkedinConsumerSecret
          },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res2 => {
          console.log(res2);
        })
        .catch(error => {
          console.log(error);
        });
      res.send(true);
    } else {
      console.log(req.query);
      res.send(false);
    }*/
  }
};
