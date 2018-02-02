const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

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
                        if (!user)
                            return done(
                                null,
                                false,
                                req.flash("loginMessage", "No user found.")
                            );

                        if (!user.validPassword(password))
                            return done(
                                null,
                                false,
                                req.flash(
                                    "loginMessage",
                                    "Oops! Wrong password."
                                )
                            );
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
                        User.findOne({ email: email }, function(
                            err,
                            existingUser
                        ) {
                            if (err) return done(err);

                            // User already exists
                            if (existingUser) {
                                return done(
                                    null,
                                    false,
                                    req.flash(
                                        "signupMessage",
                                        "That email is already taken."
                                    )
                                );
                            } else {
                                // User does not exist yet
                                var newUser = new User();
                                newUser.role = "demo";
                                newUser.email = email;
                                newUser.password = newUser.generateHash(
                                    password
                                );
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
};
