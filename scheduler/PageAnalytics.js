const Account = require("../models/Account");

const {
  requestAllFacebookPageAnalytics,
  requestAllInstagramPageAnalytics
} = require("../services/analyticsFunctions");

module.exports = {
  main: () => {
    Account.find({}, (err, accounts) => {
      if (err || !accounts) {
      }
      const socialIDs = [];
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        if (account.socialID) {
          if (socialIDs.includes(account.socialID)) {
            // don't fetch analytics data twice for the same account
            continue;
          }
          socialIDs.push(account.socialID);
          if (
            account.socialType === "facebook" &&
            account.accountType === "page"
          ) {
            continue;
            requestAllFacebookPageAnalytics(account);
          } else if (
            account.socialType === "instagram" &&
            account.accountType === "page"
          ) {
            requestAllInstagramPageAnalytics(account);
          }
        }
      }
    });
  }
};
