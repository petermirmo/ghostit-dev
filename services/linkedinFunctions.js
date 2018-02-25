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
        // Get Linkedin profile
        Account.findOne(
            {
                userID: req.user._id,
                socialType: "linkedin",
                accountType: "profile"
            },
            function(err, account) {
                if (err) return handleError(err);
                if (account) {
                    // Use Linkedin profile access token to get account pages
                    var LI = Linkedin.init(account.accessToken);

                    // Get all companies that the user is an admin of
                    LI.companies.asAdmin(function(err, companies) {
                        if (err) return handleError(err);
                        // Linkedin groups (companies) do not come with access tokens so we will use the
                        // user's profile access token
                        // We also want to set accountType and socialType
                        for (var index in companies) {
                            companies[index].accountType = "page";
                            companies[index].socialType = "linkedin";
                            companies[index].access_token = account.accessToken;
                        }
                        res.send(companies.values);
                    });
                } else {
                    res.send(false);
                }
            }
        );
    },
    getLinkedinCode: function(req, res) {
        // Get code from Linkedin to trade for access code
        var scope = [
            "r_basicprofile",
            "r_emailaddress",
            "rw_company_admin",
            "w_share"
        ];

        Linkedin.auth.authorize(res, scope);
    },
    getLinkedinAccessToken: function(req, res) {
        // Get access token from Linkedin
        Linkedin.auth.getAccessToken(
            res,
            req.query.code,
            req.query.state,
            function(err, results) {
                if (err) res.send(false);
                var accessToken = results.access_token;
                // User access token to get profile information
                var LI = Linkedin.init(accessToken);

                LI.people.me(function(err, $in) {
                    if (err) res.send(false);
                    var linkedinProfile = $in;

                    // Make sure account is not added already
                    Account.findOne({ socialID: linkedinProfile.id }, function(
                        err,
                        account
                    ) {
                        if (err) return done(err);
                        if (account) {
                            res.send(false);
                        } else {
                            // Account does not exist
                            var user = req.session.passport.user; // pull the user out of the session
                            var newAccount = new Account();

                            newAccount.userID = user._id;
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
                        }
                    });
                });
            }
        );
    }
};
