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
						res.send(groups);
					});
				} else {
					res.send(false);
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

					FB.api("me/accounts", "get", function(pages) {
						// Init some values
						for (let index in pages) {
							pages[index].accountType = "page";
							pages[index].socialType = "facebook";
						}
						res.send({ success: true, pages: pages });
					});
				} else {
					res.send({ success: false });
				}
			}
		);
	}
};
