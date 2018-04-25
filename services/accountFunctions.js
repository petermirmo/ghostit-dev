const User = require("../models/User");
const Account = require("../models/Account");

module.exports = {
	disconnectAccount: function(req, res) {
		var account = req.body;

		Account.remove({ _id: account._id }, function(err) {
			if (err) {
				console.log(err);
				res.send(false);
				return;
			}
			res.send(true);
		});
	},
	saveAccount: function(req, res) {
		var page = req.body;
		let userID;
		if (req.user.signedInAsUser.id) {
			userID = req.user.signedInAsUser.id;
		} else {
			userID = req.user._id;
		}

		var newAccount = new Account();
		newAccount.userID = userID;
		newAccount.socialType = page.socialType;
		newAccount.accountType = page.accountType;
		newAccount.accessToken = page.access_token;
		newAccount.socialID = page.id;
		newAccount.givenName = page.name;
		newAccount.category = page.category;
		newAccount.lastRenewed = new Date().getTime();

		newAccount.save().then(result => res.send(true));
	},
	getAccounts: function(req, res) {
		let userID;
		if (req.user.signedInAsUser.id) {
			userID = req.user.signedInAsUser.id;
		} else {
			userID = req.user._id;
		}
		Account.find({ userID: userID }, function(err, accounts) {
			if (err) {
				console.log(err);
				res.send(false);
				return;
			}
			res.send(accounts);
		});
	}
};
