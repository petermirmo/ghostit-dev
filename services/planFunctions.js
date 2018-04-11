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
	},
	signUpToPlan: function(req, res) {
		let plan = new Plan(req.body);
		let unitsOfContent =
			plan.websiteBlogPosts +
			plan.socialPosts / 15 +
			plan.eBooks * 3 +
			plan.instagramPosts / 15 * 2 +
			plan.emailNewsletters;
		let price = 0;
		let discount = 150;

		for (let i = 0; i < unitsOfContent; i++) {
			if (i > 1 && discount > 100) {
				discount = discount - 2.5;
			}
			price = price + discount;
		}
		plan.price = price;
		console.log(plan);
		res.send(true);
	}
};
function handleError(res, errorMessage) {
	console.log(errorMessage);
	res.send(false);
	return;
}
