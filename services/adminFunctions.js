const User = require("../models/User");

var cloudinary = require("cloudinary");

module.exports = {
	getUsers: function(req, res) {
		if (req.user.role !== "admin") {
			// TO DO: Punish hacker?
			handleError(res, "HACKER ALERT!!!!");
		} else {
			User.find({}, function(err, users) {
				if (err) {
					handleError(res, err);
					return;
				} else {
					res.send(users);
				}
			});
		}
	},
	updateUser: function(req, res) {
		if (req.user.role !== "admin") {
			// TO DO: Punish hacker?
			handleError(res, "HACKER ALERT!!!!!");
		} else {
			let user = req.body;
			User.findOneAndUpdate({ _id: user._id }, user, function(err, oldUser) {
				if (err) {
					handleError(res, err);
					return;
				} else {
					res.send(true);
				}
			});
		}
	},
	getClients: function(req, res) {
		if (req.user.role === "admin") {
			User.find({ role: "client" }, function(err, users) {
				if (err) {
					handleError(res, err);
				} else {
					res.send(users);
				}
			});
		} else if (req.user.role === "manager") {
			User.find({ "writer.id": req.user._id }, function(err, users) {
				if (err) {
					handleError(res, err);
				} else {
					res.send(users);
				}
			});
		} else {
			handleError(res, "Hacker Alert!");
		}
	},
	signInAsUser: function(req, res) {
		var currentUser = req.user;
		var clientUser = req.body;
		if (currentUser.role === "manager") {
			if (String(currentUser._id) === clientUser.writer.id) {
				currentUser.signedInAsUser = { id: clientUser._id, fullName: clientUser.fullName };
				currentUser.save().then(result => res.send(true));
			} else {
				handleError(res, "User is a manager, but the client is not a client of this manager!");
			}
		} else if (currentUser.role === "admin") {
			currentUser.signedInAsUserID = clientUser._id;
			currentUser.save().then(result => res.send(true));
		} else {
			handleError(res, "HACKER ALERT!!!!");
		}
	}
};
function handleError(res, errorMessage) {
	console.log(errorMessage);
	res.send(false);
	return;
}
