const User = require("../models/User");
const Account = require("../models/Account");
const cloudinary = require("cloudinary");
const fs = require("fs");
const request = require("request");

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
