const User = require("../models/User");
const Account = require("../models/Account");
const Post = require("../models/Post");
const Analytics = require("../models/Analytics");
const FB = require("fb");
const moment = require("moment-timezone");
const generalFunctions = require("./generalFunctions");

const { requestAllFacebookPageAnalytics } = require("./analyticsFunctions");
const { fbAccountRequest, instagramAccountRequest } = require("../constants");

const instagramSinceUntilString =
  "&since=" +
  Math.round(new moment().subtract(27, "days").valueOf() / 1000) +
  "&until=" +
  Math.round(new moment().valueOf() / 1000);

module.exports = {
  disconnectAccount: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    let { accountID } = req.params;

    Account.findOne({ _id: accountID }, (err, account) => {
      if (err) {
        generalFunctions.handleError(res, err);
      } else if (!account)
        generalFunctions.handleError(res, "Account not found");
      else {
        if (account.userID == String(userID)) {
          account.remove();
          res.send(true);
        } else res.send(false);
      }
    });
  },
  saveAccount: (req, res) => {
    let page = req.body;
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Account.find({ socialID: page.id }, (err, accounts) => {
      Analytics.findOne({ associatedID: page.id }, (err, foundAnalytics) => {
        let analyticsID = "";
        if (foundAnalytics) analyticsID = foundAnalytics._id;

        const createNewAccount = () => {
          let newAccount = new Account();
          newAccount.userID = userID;
          newAccount.socialType = page.socialType;
          newAccount.accountType = page.accountType;
          newAccount.accessToken = page.access_token;
          newAccount.socialID = page.id;
          newAccount.category = page.category;
          newAccount.username = page.username;
          newAccount.analyticsID = analyticsID;
          if (!newAccount.username) newAccount.username = page.name;

          newAccount.lastRenewed = new Date().getTime();

          newAccount.save().then(result => {
            if (
              result.socialType === "facebook" &&
              result.accountType === "page"
            ) {
              requestAllFacebookPageAnalytics(
                result,
                fbAccountRequest + "last_90d"
              );
            } else if (
              result.socialType === "instagram" &&
              result.accountType === "page"
            ) {
              requestAllFacebookPageAnalytics(
                result,
                instagramAccountRequest + instagramSinceUntilString
              );
            }
            res.send(true);
          });
        };
        if (accounts.length === 0) {
          createNewAccount();
        } else if (accounts.length > 0) {
          let asyncCounter = 0;
          let accountFoundUser = false;

          for (let index in accounts) {
            let account = accounts[index];
            account.accessToken = page.access_token;
            account.username = page.username;
            account.analyticsID = analyticsID;

            if (!account.username) account.username = page.name;

            if (String(account.userID) == userID) accountFoundUser = true;

            asyncCounter++;
            account.save((err, result) => {
              if (
                accountFoundUser &&
                result.socialType === "facebook" &&
                result.accountType === "page"
              ) {
                requestAllFacebookPageAnalytics(
                  result,
                  fbAccountRequest + "last_90d"
                );
              } else if (
                result.socialType === "instagram" &&
                result.accountType === "page"
              ) {
                requestAllFacebookPageAnalytics(
                  result,
                  instagramAccountRequest + instagramSinceUntilString
                );
              }
              asyncCounter--;
              if (asyncCounter === 0) {
                if (!accountFoundUser) createNewAccount();
                else {
                  return res.send(true);
                }
              }
            });
          }
        } else return res.send(true);
      });
    });
  },
  getAccounts: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Account.find({ userID }, (err, accounts) => {
      if (err) generalFunctions.handleError(res, err);
      else if (!accounts)
        generalFunctions.handleError(res, "Accounts not found");
      else res.send({ success: true, accounts: accounts });
    });
  }
};
