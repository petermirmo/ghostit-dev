const User = require("../models/User");
const Account = require("../models/Account");
const keys = require("../config/keys");
var Linkedin = require("node-linkedin")(
	keys.linkedinConsumerKey,
	keys.linkedinConsumerSecret,
	keys.linkedinCallbackURL
);
module.exports = {
	getLinkedinPages: function(req, res) {
		let userID;
		if (req.user.signedInAsUser.id) {
			userID = req.user.signedInAsUser.id;
		} else {
			userID = req.user._id;
		}
		// Get Linkedin profile
		Account.findOne(
			{
				userID: userID,
				socialType: "linkedin",
				accountType: "profile"
			},
			function(err, account) {
				if (err) return handleError(err);
				if (account) {
					// Use Linkedin profile access token to get account pages
					var LI = Linkedin.init(account.accessToken);

					// Get all companies that the user is an admin of
					LI.companies.asAdmin(function(err, results) {
						var companies = results.values;
						if (err) return handleError(err);
						// Linkedin groups (companies) do not come with access tokens so we will use the
						// user's profile access token
						// We also want to set accountType and socialType
						for (var index in companies) {
							companies[index].accountType = "page";
							companies[index].socialType = "linkedin";
							companies[index].access_token = account.accessToken;
						}
						res.send(companies);
					});
				} else {
					res.send(false);
				}
			}
		);
	},
	getLinkedinCode: function(req, res) {
		// Get code from Linkedin to trade for access code
		var scope = ["r_basicprofile", "r_emailaddress", "rw_company_admin", "w_share"];

		Linkedin.auth.authorize(res, scope);
	},
	getLinkedinAccessToken: function(req, res) {
		// Get access token from Linkedin
		Linkedin.auth.getAccessToken(res, req.query.code, req.query.state, function(err, results) {
			if (err) res.send(false);
			var accessToken = results.access_token;
			// User access token to get profile information
			var LI = Linkedin.init(accessToken);

			LI.people.me(function(err, $in) {
				if (err) res.send(false);
				var linkedinProfile = $in;

				// pull the user out of the session
				var user = req.user;

				if (!user) {
					user = req.session.passport.user;
				}
				var newAccount = new Account();
				let userID;
				if (user.signedInAsUser.id) {
					userID = user.signedInAsUser.id;
				} else {
					userID = user._id;
				}
				newAccount.userID = userID;
				newAccount.socialType = "linkedin";
				newAccount.accountType = "profile";
				newAccount.accessToken = accessToken;
				newAccount.socialID = linkedinProfile.id;
				newAccount.givenName = linkedinProfile.firstName;
				newAccount.familyName = linkedinProfile.lastName;
				newAccount.email = linkedinProfile.emailAddress;

				newAccount.save(function(err) {
					if (err) res.send(false);

					res.redirect("/content");
				});
			});
		});
	}
};
