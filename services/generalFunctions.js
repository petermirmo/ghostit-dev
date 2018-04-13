const User = require("../models/User");
const Account = require("../models/Account");
var cloudinary = require("cloudinary");

module.exports = {
	deleteFile: function(req, res) {
		cloudinary.uploader.destroy(req.params.publicID, function(result) {
			res.send(true);
			// TO DO: handle error here
		});
	},
	getTimezone: function(req, res) {
		if (req.user.signedInAsUser.id) {
			User.findOne({ _id: req.user.signedInAsUser.id }, function(err, user) {
				if (err) {
					handleError(res, err);
				} else if (user) {
					res.send(user.timezone);
				} else {
					handleError(res, "Cannot find signedInAsUser");
				}
			});
		} else {
			res.send(req.user.timezone);
		}
	}
};

function handleError(res, errorMessage) {
	console.log(errorMessage);
	res.send(false);
	return;
}
