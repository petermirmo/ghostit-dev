const passport = require("passport");
const User = require("../models/User");
const Account = require("../models/Account");
var FB = require("fb");

module.exports = app => {
    // Logout
    app.get("/api/logout", (req, res) => {
        req.session.destroy();
        res.redirect("/");
    });

    // Get current user
    app.get("/api/user", (req, res) => {
        res.send(req.user);
    });

    // Update user account
    app.post("/api/user/id", (req, res) => {
        User.findById(req.session.passport.user._id, function(err, user) {
            if (err) return handleError(err);
            // Check if email has changed
            if (req.session.passport.user.email != req.body.email) {
                // Check if changed email is in use in a different account
                User.findOne({ email: req.body.email }, function(err, user) {
                    if (err) return handleError(err);
                    // Email already exists
                    if (user) {
                        return res.send("Email already in use!");
                    } else {
                        // Update user
                        User.findById(req.session.passport.user._id, function(
                            err,
                            user
                        ) {
                            if (err) return handleError(err);
                            user.email = req.body.email;
                            user.password = user.generateHash(
                                req.body.password
                            );
                            user.fullName = req.body.fullName;
                            user.country = req.body.country;
                            user.timezone = req.body.timezone;
                            user.website = req.body.website;
                            user.save(function(err, updatedUser) {
                                if (err) return handleError(err);
                                if (updatedUser) {
                                    res.redirect("/profile");
                                } else {
                                    res.send("errors");
                                }
                            });
                        });
                    }
                });
            } else {
                // Update user
                User.findById(req.session.passport.user._id, function(
                    err,
                    user
                ) {
                    if (err) return handleError(err);
                    user.email = req.body.email;
                    user.password = user.generateHash(req.body.password);
                    user.fullName = req.body.fullName;
                    user.country = req.body.country;
                    user.timezone = req.body.timezone;
                    user.website = req.body.website;
                    user.save(function(err, updatedUser) {
                        if (err) return handleError(err);
                        if (updatedUser) {
                            res.redirect("/profile");
                        } else {
                            res.send("errors");
                        }
                    });
                });
            }
        });
    });

    // Middleware check
    app.get("/api/isUserSignedIn", (req, res) => {
        res.send(req.isAuthenticated());
    });

    // Register user
    app.post(
        "/api/user",
        passport.authenticate("local-signup", {
            successRedirect: "/content",
            failureRedirect: "/",
            failureFlash: true
        })
    );

    // Login user
    app.post(
        "/api/auth/login",
        passport.authenticate("local-login", {
            successRedirect: "/content",
            failureRedirect: "/",
            failureFlash: true
        })
    );

    // Add Facebook profile
    app.get(
        "/api/facebook",
        passport.authenticate("facebook", {
            scope: [
                "public_profile",
                "email",
                "user_managed_groups",
                "publish_pages",
                "manage_pages",
                "business_management",
                "publish_actions"
            ]
        })
    );
    app.get(
        "/api/facebook/callback",
        passport.authenticate("facebook", {
            successRedirect: "/content",
            failureRedirect: "/"
        })
    );

    // Get all accounts that a user has connected
    app.get("/api/accounts", (req, res) => {
        Account.find({ userID: req.user._id }, function(err, accounts) {
            if (err) return handleError(err);
            res.send(accounts);
        });
    });

    // Post to facebook
    app.post("/api/facebook/post", (req, res) => {
        console.log(req);
        res.redirect("/profile");
    });

    // Get Facebook pages of profile accounts
    app.get("/api/facebook/pages", (req, res) => {
        // Get facebook profile
        Account.findOne(
            {
                userID: req.user._id,
                socialType: "facebook",
                accountType: "profile"
            },
            function(err, account) {
                if (err) return handleError(err);
                if (account) {
                    // Use facebook profile access token to get account pages
                    FB.setAccessToken(account.accessToken);

                    FB.api("me/accounts", "get", function(pages) {
                        res.send(pages);
                    });
                } else {
                    res.send("Facebook account error.");
                }
            }
        );
    });

    // Save page to database
    app.post("/api/facebook/page", (req, res) => {
        var page = req.body;
        // For each account the user is adding

        Account.findOne({ socialID: page.id }, function(err, account) {
            if (err) return handleError(err);
            if (account) {
                // Page already added
                res.send(false);
            } else {
                var newAccount = new Account();
                newAccount.userID = req.user.id;
                newAccount.socialType = "facebook";
                newAccount.accountType = "page";
                newAccount.accessToken = page.access_token;
                newAccount.socialID = page.id;
                newAccount.givenName = page.name;
                newAccount.category = page.category;
                newAccount.save().then(result => res.send(true));
            }
        });
    });
    app.delete("/api/facebook/page", (req, res) => {
        var account = req.body;
        if (account.accountType === "profile") {
            Account.remove(
                { userID: account.userID, socialType: "facebook" },
                function(err) {
                    if (err) return handleError(err);
                    res.send(true);
                }
            );
        } else if (account.accountType === "page") {
            Account.remove({ _id: account._id }, function(err) {
                if (err) return handleError(err);
                res.send(true);
            });
        }
    });

    // Get Facebook groups of profile accounts
    app.get("/api/facebook/pages", (req, res) => {
        // Get facebook profile
        Account.findOne(
            {
                userID: req.user._id,
                socialType: "facebook",
                accountType: "profile"
            },
            function(err, account) {
                if (err) return handleError(err);
                if (account) {
                    // Use facebook profile access token to get account groups
                    FB.setAccessToken(account.accessToken);

                    FB.api("me/groups", "get", function(pages) {
                        res.send(pages);
                    });
                } else {
                    res.send("Facebook account error.");
                }
            }
        );
    });
};
