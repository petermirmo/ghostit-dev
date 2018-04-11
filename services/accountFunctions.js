const User = require("../models/User");
const Account = require("../models/Account");

module.exports = {
	disconnectAccount: function(req, res) {
		var account = req.body;
		if (account.accountType === "profile") {
			Account.remove(
				{
					userID: account.userID,
					socialType: account.socialType
				},
				function(err) {
					if (err) return handleError(err);
					res.send(true);
				}
			);
		} else {
			Account.remove({ _id: account._id }, function(err) {
				if (err) return handleError(err);
				res.send(true);
			});
		}
	},
	saveAccount: function(req, res) {
		var page = req.body;
		let userID;
		if (req.user.signedInAsUser.id) {
			userID = req.user.signedInAsUser.id;
		} else {
			userID = req.user._id;
		}

		// Check to see if account is already added
		Account.findOne({ socialID: page.id }, function(err, account) {
			if (err) return handleError(err);
			if (account) {
				// Page already added
				res.send(false);
			} else {
				var newAccount = new Account();
				newAccount.userID = userID;
				newAccount.socialType = page.socialType;
				newAccount.accountType = page.accountType;
				newAccount.accessToken = page.access_token;
				newAccount.socialID = page.id;
				newAccount.givenName = page.name;
				newAccount.category = page.category;
				newAccount.save().then(result => res.send(true));
			}
		});
	},
	getAccounts: function(req, res) {
		let userID;
		if (req.user.signedInAsUser.id) {
			userID = req.user.signedInAsUser.id;
		} else {
			userID = req.user._id;
		}
		Account.find({ userID: userID }, function(err, accounts) {
			if (err) return handleError(err);
			res.send(accounts);
		});
	}
};
