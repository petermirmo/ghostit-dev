const User = require("../models/User");
const Plan = require("../models/Plan");

var cloudinary = require("cloudinary");

module.exports = {
	getUsers: function(req, res) {
		if (req.user.role !== "admin") {
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
			currentUser.signedInAsUser = { id: clientUser._id, fullName: clientUser.fullName };
			currentUser.save().then(result => res.send(true));
		} else {
			handleError(res, "HACKER ALERT!!!!");
		}
	},
	signOutOfUserAccount: function(req, res) {
		var currentUser = req.user;
		currentUser.signedInAsUser = undefined;
		currentUser.save().then(result => res.send(true));
	},
	createPlan: function(req, res) {
		if (req.user.role !== "admin") {
			handleError(res, "HACKER ALERT!!!!!");
		} else {
			const newPlan = req.body;

			// Check if we are editting a plan or creating a new plan!
			if (newPlan._id) {
				Plan.update({ _id: newPlan._id }, { $set: newPlan }).then(result => {
					res.send(true);
				});
			} else {
				Plan.find({ name: newPlan.name }, function(err, Plans) {
					if (err) {
						handleError(res, err);
					} else if (Plans.length > 0) {
						// There is already a plan with this name!
						handleError(res, "Plan already exists!");
					} else {
						let plan = new Plan(newPlan);
						plan.createdBy = req.user._id;
						plan.private = true;
						plan.save().then(result => {
							res.send(true);
						});
					}
				});
			}
		}
	},
	getPlans: function(req, res) {
		if (req.user.role !== "admin") {
			handleError(res, "HACKER ALERT!!!!!");
		} else {
			Plan.find({}, function(err, plans) {
				if (err) {
					handleError(res, err);
				} else {
					res.send(plans);
				}
			});
		}
	}
};
function handleError(res, errorMessage) {
	console.log(errorMessage);
	res.send(false);
	return;
}
