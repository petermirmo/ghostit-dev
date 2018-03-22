const User = require("../models/User");

var cloudinary = require("cloudinary");

module.exports = {
	getUsers: function(req, res) {
		if (req.user.role !== "admin") {
			// TO DO: Punish hacker?
			console.log("HACKER ALERT!!!!!");
			res.send(false);
			return;
		} else {
			User.find({}, function(err, users) {
				if (err) {
					console.log(err);
					res.send(false);
					return;
				}
				res.send(users);
			});
		}
	},
	signInAsUser: function(req, res) {
		console.log(req.body);
		res.send(true);
	}
};
