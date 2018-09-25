const User = require("../models/User");
const Account = require("../models/Account");
const Post = require("../models/Post");
const FB = require("fb");
const moment = require("moment-timezone");

module.exports = {
  disconnectAccount: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    let { accountID } = req.params;
    //
    Account.findOne({ _id: accountID }, (err, account) => {
      if (err || !account) {
        console.log(err);
        res.send(false);
      } else {
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
    console.log(newAccount);

    newAccount.save().then(result => res.send(true));
  },
  getAccounts: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Account.find({ userID: userID }, function(err, accounts) {
      if (err) {
        console.log(err);
        res.send({ success: false });
        return;
      }
      res.send({ success: true, accounts: accounts });
    });
  }
};
