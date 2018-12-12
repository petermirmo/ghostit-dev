const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const LinkedInStrategy = require("passport-linkedin").Strategy;
const bcrypt = require("bcrypt-nodejs");
const nodemailer = require("nodemailer");

const keys = require("../config/keys");

const User = require("../models/User");
const Account = require("../models/Account");

const { sendEmail } = require("../MailFiles/sendEmail");

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
        passwordField: "password"
      },
      function(email, password, done) {
        // Use lower-case e-mails to avoid case-sensitive e-mail matching
        if (email) email = email.toLowerCase();

        User.findOne({ email }, function(err, user) {
          if (err) {
            return done(
              false,
              false,
              "Something went wrong :(. Please refresh the page and try again!"
            );
          } else if (!user) {
            return done(
              false,
              false,
              "No account was found with this email address!"
            );
          } else if (!bcrypt.compareSync(password, user.password)) {
            if (user.tempPassword) {
              if (bcrypt.compareSync(password, user.tempPassword)) {
                user.password = user.tempPassword;
                user.tempPassword = undefined;
                user.save().then(result => {
                  return done(false, result, "Success");
                });
              } else {
                return done(false, false, "Invalid password! :(");
              }
            } else {
              return done(false, false, "Invalid password! :(");
            }
          } else {
            return done(false, user, "Success");
          }
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
        passReqToCallback: true
      },
      (req, email, password, done) => {
        if (!req.user) {
          User.findOne({ email }, (err, existingUser) => {
            if (err) {
              return done(false, false, "An error occured :(");
            } else if (existingUser) {
              return done(
                false,
                false,
                "A user with this email already exists!"
              );
            } else {
              let newUser = new User();
              newUser.role = "demo";
              newUser.plan = { id: "none", name: "none" };
              newUser.writer = { id: "none", name: "none" };
              newUser.email = email;
              newUser.password = newUser.generateHash(req.body.password);
              newUser.fullName = req.body.fullName;
              newUser.country = req.body.country;
              newUser.timezone = req.body.timezone;
              newUser.website = req.body.website;
              newUser.dateCreated = new Date();

              newUser.save().then(user => {
                sendEmail(
                  user,
                  "Ghostit sign up successful!",
                  "Welcome to Ghostit! Your account is waiting for you. https://www.ghostit.co",
                  () => {}
                );
                done(null, user, "Success!");
              });
            }
          });
        } else {
          return done(null, null, "User already logged in!");
        }
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
        profileURL:
          "https://graph.facebook.com/v2.12/me?fields=first_name,last_name,email",
        profileFields: ["id", "email", "name"], // For requesting permissions from Facebook API
        passReqToCallback: true
      },
      function(req, accessToken, refreshToken, profile, done) {
        let userID = req.user._id;
        if (req.user.signedInAsUser) {
          if (req.user.signedInAsUser.id) {
            userID = req.user.signedInAsUser.id;
          }
        }
        Account.find({ socialID: profile.id }, (err, accounts) => {
          let createNewAccount = () => {
            let newAccount = new Account();
            newAccount.userID = userID;
            newAccount.socialType = "facebook";
            newAccount.accountType = "profile";
            newAccount.accessToken = accessToken;
            newAccount.socialID = profile.id;
            newAccount.givenName = profile._json.first_name;
            newAccount.familyName = profile._json.last_name;
            newAccount.email = profile._json.email;
            newAccount.provider = profile.provider;
            newAccount.lastRenewed = new Date().getTime();

            newAccount.save().then(account => {
              done(null, req.session.passport.user);
            });
          };
          if (accounts.length === 0) {
            createNewAccount();
          } else if (accounts.length > 0) {
            let asyncCounter = 0;
            let accountFoundUser = false;
            for (let index in accounts) {
              let account = accounts[index];

              if (account.userID == userID) accountFoundUser = true;

              account.accessToken = accessToken;
              asyncCounter++;

              account.save((err, result) => {
                asyncCounter--;
                if (asyncCounter === 0) {
                  if (!accountFoundUser) createNewAccount();
                  else return done(null, req.session.passport.user);
                }
              });
            }
          } else return done(null, req.session.passport.user);
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
        // Account does not exist
        let user = req.user; // pull the user out of the session
        let userID = req.user._id;
        if (req.user.signedInAsUser) {
          if (req.user.signedInAsUser.id) {
            userID = req.user.signedInAsUser.id;
          }
        }
        Account.find({ userID, socialID: profile.id }, (err, accounts) => {
          let createNewAccount = () => {
            let newAccount = new Account();

            // Split displayName into first name and last name
            let givenName;
            let familyName;
            for (let index in profile.displayName) {
              if (profile.displayName[index] === " ") {
                givenName = profile.displayName.slice(0, index);
                familyName = profile.displayName.slice(
                  index,
                  profile.displayName.length
                );
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
            newAccount.lastRenewed = new Date().getTime();

            newAccount.save(err => {
              if (err) return done(err);
              return done(null, user);
            });
          };
          if (accounts.length === 0) {
            createNewAccount();
          } else if (accounts.length > 0) {
            let asyncCounter = 0;
            let accountFoundUser = false;

            for (let index in accounts) {
              let account = accounts[index];
              if (account.userID == userID) accountFoundUser = true;

              account.accessToken = token;
              account.tokenSecret = tokenSecret;

              asyncCounter++;
              account.save((err, result) => {
                asyncCounter--;
                if (asyncCounter === 0) {
                  if (!accountFoundUser) createNewAccount();
                  else return done(null, req.session.passport.user);
                }
              });
            }
          } else return done(null, req.session.passport.user);
        });
      }
    )
  );
};
