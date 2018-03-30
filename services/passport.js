const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const LinkedInStrategy = require("passport-linkedin").Strategy;
const keys = require("../config/keys");

const User = require("../models/User");
const Account = require("../models/Account");

module.exports = function(passport) {
	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id).then(user => {
			done(null, user);
		});
	});

	// Local email login
	passport.use(
		"local-login",
		new LocalStrategy(
			{
				// by default, local strategy uses username and password, we will override with email
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
			},
			function(req, email, password, done) {
				if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

				// asynchronous
				process.nextTick(function() {
					User.findOne({ email: email }, function(err, user) {
						// if there are any errors, return the error
						if (err) return done(err);

						// if no user is found, return the message
						if (!user) return done(null, false, req.flash("loginMessage", "No user found."));

						if (!user.validPassword(password))
							return done(null, false, req.flash("loginMessage", "Oops! Wrong password."));
						else
							// all is well, return user
							return done(null, user);
					});
				});
			}
		)
	);

	// Local email sign up
	passport.use(
		"local-signup",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true
			},
			function(req, email, password, done) {
				process.nextTick(function() {
					if (!req.user) {
						User.findOne({ email: email }, function(err, existingUser) {
							if (err) return done(err);

							// User already exists
							if (existingUser) {
								return done(null, false, req.flash("signupMessage", "That email is already taken."));
							} else {
								// User does not exist yet
								var newUser = new User();
								newUser.role = "demo";
								newUser.email = email;
								newUser.password = newUser.generateHash(password);
								newUser.fullName = req.body.fullName;
								newUser.country = req.body.country;
								newUser.timezone = req.body.timezone;
								newUser.website = req.body.website;
								newUser.save().then(user => done(null, user));
							}
						});
					} else {
						return done(null, null);
					}
				});
			}
		)
	);

	// Add Facebook account
	passport.use(
		new FacebookStrategy(
			{
				clientID: keys.fbClientID,
				clientSecret: keys.fbClientSecret,
				callbackURL: keys.fbCallbackUrl,
				profileURL: "https://graph.facebook.com/v2.12/me?fields=first_name,last_name,email",
				profileFields: ["id", "email", "name"], // For requesting permissions from Facebook API
				passReqToCallback: true
			},
			function(req, accessToken, refreshToken, profile, done) {
				let userID;
				if (req.user.signedInAsUser.id) {
					userID = req.user.signedInAsUser.id;
				} else {
					userID = req.user._id;
				}
				// Check if account exists
				Account.findOne({ socialID: profile.id }, function(err, account) {
					if (err) return done(err);
					if (account) {
						return done("Account already exists");
					} else {
						// Account does not exist
						var newAccount = new Account();
						newAccount.userID = userID;
						newAccount.socialType = "facebook";
						newAccount.accountType = "profile";
						newAccount.accessToken = accessToken;
						newAccount.socialID = profile.id;
						newAccount.givenName = profile._json.first_name;
						newAccount.familyName = profile._json.last_name;
						newAccount.email = profile._json.email;
						newAccount.provider = profile.provider;
						newAccount.save().then(account => done(null, req.session.passport.user));
					}
				});
			}
		)
	);

	// Add Twitter account
	passport.use(
		new TwitterStrategy(
			{
				consumerKey: keys.twitterConsumerKey,
				consumerSecret: keys.twitterConsumerSecret,
				callbackURL: keys.twitterCallbackURL,
				passReqToCallback: true
			},
			function(req, token, tokenSecret, profile, done) {
				// Check if account exists
				Account.findOne({ socialID: profile.id }, function(err, account) {
					if (err) return done(err);
					if (account) {
						return done("Account already exists");
					} else {
						// Account does not exist
						var user = req.session.passport.user; // pull the user out of the session
						let userID;
						if (user) {
							userID = user.id;
						} else {
							userID = req.user._id;
						}
						var newAccount = new Account();

						// Split displayName into first name and last name
						var givenName;
						var familyName;
						for (var index in profile.displayName) {
							if (profile.displayName[index] === " ") {
								givenName = profile.displayName.slice(0, index);
								familyName = profile.displayName.slice(index, profile.displayName.length);
							}
						}

						newAccount.userID = userID;
						newAccount.socialType = "twitter";
						newAccount.accountType = "profile";
						newAccount.accessToken = token;
						newAccount.tokenSecret = tokenSecret;
						newAccount.socialID = profile.id;
						newAccount.username = profile.username;
						newAccount.givenName = givenName;
						newAccount.familyName = familyName;
						newAccount.email = profile.email;

						newAccount.save(function(err) {
							if (err) return done(err);

							return done(null, user);
						});
					}
				});
			}
		)
	);
};
