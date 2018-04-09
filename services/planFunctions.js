const User = require("../models/User");
const Plan = require("../models/Plan");

module.exports = {
	getPublicPlans: function(req, res) {
		Plan.find({ private: false }, function(err, plans) {
			if (err) {
				handleError(res, err);
			} else {
				res.send(plans);
			}
		});
	}
};
function handleError(res, errorMessage) {
	console.log(errorMessage);
	res.send(false);
	return;
}
