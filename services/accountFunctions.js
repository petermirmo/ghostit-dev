const User = require("../models/User");
const Account = require("../models/Account");
const Post = require("../models/Post");
const FB = require("fb");
const moment = require("moment-timezone");
const generalFunctions = require("./generalFunctions");

module.exports = {
  disconnectAccount: function(req, res) {
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
  saveAccount: function(req, res) {
    var page = req.body;
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Account.findOne({ userID, socialID: page.id }, (err, account) => {
      if (!account) {
        var newAccount = new Account();
        newAccount.userID = userID;
        newAccount.socialType = page.socialType;
        newAccount.accountType = page.accountType;
        newAccount.accessToken = page.access_token;
        newAccount.socialID = page.id;
        newAccount.givenName = page.name;
        newAccount.category = page.category;
        newAccount.username = page.username;
        newAccount.lastRenewed = new Date().getTime();

        newAccount.save().then(result => res.send(true));
      } else if (account) {
        account.accessToken = page.access_token;
        account.save((err, result) => {
          return res.send(true);
        });
      } else return res.send(true);
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
