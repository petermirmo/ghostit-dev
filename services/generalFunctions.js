const User = require("../models/User");
const Account = require("../models/Account");
const cloudinary = require("cloudinary");

module.exports = {
	deleteFile: function(req, res) {
		cloudinary.uploader.destroy(req.params.publicID, function(result) {
			res.send(true);
			// TO DO: handle error here
		});
	}
};

function handleError(res, errorMessage) {
	console.log(errorMessage);
	res.send(false);
	return;
}
