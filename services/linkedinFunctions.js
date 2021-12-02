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
          // Get all companies that the user is an admin of
          axios
            .get(
              "https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee",
              {
                headers: { Authorization: "Bearer " + account.accessToken }
              }
            )
            .then(linkedinCompaniesResponse => {
              let companyURNs = linkedinCompaniesResponse.data.elements;
              let asyncCounter = 0;
              let companies = [];

              for (let index in companyURNs) {
                let linkedinURN = companyURNs[index].organizationalTarget;
                let linkedinPageID = "";
                let colonCounter = 0;

                for (let i = 0; i < linkedinURN.length; i++) {
                  if (colonCounter === 3) linkedinPageID += linkedinURN[i];
                  if (linkedinURN[i] === ":") colonCounter++;
                }

                asyncCounter++;
                axios
                  .get(
                    "https://api.linkedin.com/v2/organizations/" +
                      linkedinPageID,
                    {
                      headers: {
                        Authorization: "Bearer " + account.accessToken
                      }
                    }
                  )
                  .then(linkedinCompanyResponse => {
                    console.log(linkedinCompanyResponse);
                    let company = linkedinCompanyResponse.data;

                    // Linkedin groups (companies) do not come with access tokens so we will use the
                    // user's profile access token
                    // We also want to set accountType and socialType
                    company.accountType = "page";
                    company.socialType = "linkedin";
                    company.access_token = account.accessToken;
                    company.name = company.localizedName;
                    companies.push(company);

                    asyncCounter--;
                    if (asyncCounter === 0)
                      res.send({ success: true, pages: companies });
                  })
                  .catch(linkedinCompanyError => {
                    if (linkedinCompanyError.response) {
                      if (linkedinCompanyError.response.data)
                        console.log(linkedinCompanyError.response.data);
                      else console.log(linkedinCompanyError.response);
                    } else console.log(linkedinCompanyError);
                    asyncCounter--;
                    if (asyncCounter === 0)
                      res.send({ success: true, pages: companies });
                  });
              }
            })
            .catch(linkedinProfileErrorResonse => {
              console.log(linkedinProfileErrorResonse.response);
              generalFunctions.handleError(res, "Linkedin error");
            });
        } else {
          generalFunctions.handleError(
            res,
            "Please connect your Linkedin profile first."
          );
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
        keys.linkedinCallbackURLASCII +
        "&state=" +
        keys.linkedinState +
        "&scope=r_ads%20r_basicprofile%20r_emailaddress%20w_organization_social%20r_ads_reporting%20r_organization_social%20rw_organization_admin%20r_basicprofile%20rw_ads%20w_member_social"
    );
  },
  getLinkedinAccessToken: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    if (req.query.state == keys.linkedinState && req.query.code) {
      axios
        .post(
          "https://www.linkedin.com/oauth/v2/accessToken",
          querystring.stringify({
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: keys.linkedinCallbackURL,
            client_id: keys.linkedinConsumerKey,
            client_secret: keys.linkedinConsumerSecret
          })
        )
        .then(linkedinTokenResponse => {
          const accessToken = linkedinTokenResponse.data.access_token;

          axios
            .get("https://api.linkedin.com/v2/me", {
              headers: { Authorization: "Bearer " + accessToken }
            })
            .then(linkedinProfileResponse => {
              const linkedinProfile = linkedinProfileResponse.data;
              Account.find(
                { socialID: linkedinProfile.id },
                (err, accounts) => {
                  const createNewAccount = () => {
                    let newAccount = new Account();

                    newAccount.userID = userID;
                    newAccount.socialType = "linkedin";
                    newAccount.accountType = "profile";
                    newAccount.accessToken = accessToken;
                    newAccount.socialID = linkedinProfile.id;
                    newAccount.givenName = linkedinProfile.localizedFirstName;
                    newAccount.familyName = linkedinProfile.localizedLastName;

                    newAccount.save((err, result) => {
                      if (err) generalFunctions.handleError(res, err);
                      else res.redirect("/social-accounts/connected");
                    });
                  };

                  if (accounts.length === 0) {
                    createNewAccount();
                  } else if (accounts.length > 0) {
                    let asyncCounter = 0;
                    let accountFoundUser = false;

                    for (let index in accounts) {
                      let account = accounts[index];
                      if (String(account.userID) == userID) {
                        accountFoundUser = true;
                      }
                      account.accessToken = accessToken;
                      account.accessToken = accessToken;
                      account.givenName = linkedinProfile.localizedFirstName;
                      account.familyName = linkedinProfile.localizedLastName;

                      asyncCounter++;
                      account.save((err, result) => {
                        asyncCounter--;
                        if (asyncCounter === 0) {
                          if (!accountFoundUser) createNewAccount();
                          else res.redirect("/social-accounts/connected");
                        }
                      });
                    }
                  } else res.redirect("/social-accounts/connected");
                }
              );
            })
            .catch(linkedinProfileErrorResonse => {
              console.log(linkedinProfileErrorResonse);
              res.redirect("/social-accounts/failed");
            });
        })
        .catch(linkedinTokenErrorResponse => {
          console.log(linkedinTokenErrorResponse);
          res.redirect("/social-accounts/failed");
        });
    } else {
      console.log("No code received");
      res.redirect("/social-accounts/failed");
    }
  }
};
