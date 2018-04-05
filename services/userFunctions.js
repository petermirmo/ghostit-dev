const User = require("../models/User");

module.exports = {
	updateUser: function(req, res) {
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
						User.findById(req.session.passport.user._id, function(err, user) {
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
			} else {
				// Update user
				User.findById(req.session.passport.user._id, function(err, user) {
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
	}
};
