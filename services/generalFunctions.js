const User = require("../models/User");
const Account = require("../models/Account");
var cloudinary = require("cloudinary");

module.exports = {
	deleteFile: function(req, res) {
		cloudinary.uploader.destroy(req.params.publicID, function(result) {
			res.send(true);
			// TO DO: handle error here
		});
	}
};
