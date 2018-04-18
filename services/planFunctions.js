const User = require("../models/User");
const Plan = require("../models/Plan");
const keys = require("../config/keys");

var stripe = require("stripe")(keys.stripeSecretKey);

module.exports = {
	getUserPlan: function(req, res) {
		if (req.user.plan) {
			Plan.findOne({ _id: req.user.plan.id }, function(err, plan) {
				if (err) {
					handleError(res, err);
				} else if (plan) {
					res.send(plan);
				} else {
					res.send(false);
				}
			});
		} else {
			res.send(false);
		}
	},
	signUpToPlan: function(req, res) {
		let sixMonthCommitment = req.body.plan.checkbox;
		let currency = "usd";
		if (req.body.stripeToken.card.country === "CA") {
			currency = "cad";
		}
		let userID = req.user._id;
		if (req.user.signedInAsUser.id) {
			userID = req.user.signedInAsUser.id;
		}
		let newPlan = new Plan(req.body.plan);
		let unitsOfContent =
			newPlan.websiteBlogPosts +
			newPlan.socialPosts / 15 +
			newPlan.eBooks +
			newPlan.instagramPosts / 15 * 2 +
			newPlan.emailNewsletters;
		let price = 0;
		let discount = 150;

		// Recreate plan price because it should not come from client side
		for (let i = 0; i < unitsOfContent; i++) {
			if (i > 1 && discount > 100) {
				discount = discount - 2.5;
			}
			price = price + discount;
		}
		newPlan.currency = currency;
		newPlan.price = price;

		// Check to see if plan exists
		let findPlan;
		if (req.user.plan) {
			if (req.user.plan.id) {
				findPlan = { _id: req.user.plan.id };
			} else {
				findPlan = {
					websiteBlogPosts: newPlan.websiteBlogPosts,
					socialPosts: newPlan.socialPosts,
					instagramPosts: newPlan.instagramPosts,
					emailNewsletters: newPlan.emailNewsletters,
					eBooks: newPlan.eBooks,
					currency: newPlan.currency,
					price: newPlan.price
				};
			}
		} else {
			findPlan = {
				websiteBlogPosts: newPlan.websiteBlogPosts,
				socialPosts: newPlan.socialPosts,
				instagramPosts: newPlan.instagramPosts,
				emailNewsletters: newPlan.emailNewsletters,
				eBooks: newPlan.eBooks,
				currency: newPlan.currency,
				price: newPlan.price
			};
		}

		Plan.findOne(findPlan, function(err, plan) {
			if (err) {
				handleError(res, err);
			} else if (plan) {
				// If plan is found simply sign up user to plan
				if (plan.stripePlanID) {
					signUpUserToPlan(stripe, req.body.stripeToken, plan, res, req, sixMonthCommitment);
				} else {
					stripe.plans.create(
						{
							id: String(plan._id),
							amount: plan.price * 100,
							interval: "month",
							product: { name: String(plan._id) },
							currency: currency
						},
						function(err, stripePlan) {
							if (err) {
								handleError(res, err);
							} else {
								// Create customer in stripe
								plan.currency = currency;
								plan.stripePlanID = stripePlan.id;
								plan.save().then(savedPlanWithStripePlanID => {
									signUpUserToPlan(
										stripe,
										req.body.stripeToken,
										savedPlanWithStripePlanID,
										res,
										req,
										sixMonthCommitment
									);
								});
							}
						}
					);
				}
			} else {
				// If plan is not found then we first need to create the plan in our database
				newPlan.save().then(resultNewPlan => {
					// After created in our database create it in stripe
					stripe.plans.create(
						{
							id: String(resultNewPlan._id),
							amount: resultNewPlan.price * 100,
							interval: "month",
							product: { name: String(resultNewPlan._id) },
							currency: resultNewPlan.currency
						},
						function(err, stripePlan) {
							if (err) {
								handleError(res, err);
							} else {
								// Create customer in stripe
								resultNewPlan.stripePlanID = stripePlan.id;
								resultNewPlan.save().then(savedPlanWithStripePlanID => {
									signUpUserToPlan(
										stripe,
										req.body.stripeToken,
										savedPlanWithStripePlanID,
										res,
										req,
										sixMonthCommitment
									);
								});
							}
						}
					);
				});
			}
		});
	}
};
function handleError(res, errorMessage) {
	console.log(errorMessage);
	res.send(false);
	return;
}
function signUpUserToPlan(stripe, stripeToken, stripePlan, res, req, sixMonthCommitment) {
	// First create customer in stripe
	stripe.customers.create(
		{
			source: stripeToken.id
		},
		function(err, customer) {
			if (err) {
				handleError(res, err);
			} else {
				let userID;
				if (req.user.signedInAsUser.id) {
					userID = req.user.signedInAsUser.id;
				} else {
					userID = req.user._id;
				}

				// After user is created in stripe we want to save that ID to our platform user
				User.findOne({ _id: userID }, function(err, user) {
					if (err) {
						handleError(res, err);
					} else {
						user.stripeCustomerID = customer.id;
						user.save().then(savedUserWithStripeCustomerID => {
							// Now we have saved the customer stripe ID to this user
							// Lets finally subscribe this user to the plan
							stripe.subscriptions.create(
								{
									customer: savedUserWithStripeCustomerID.stripeCustomerID,
									items: [
										{
											plan: String(stripePlan._id)
										}
									]
								},
								function(err, subscription) {
									if (err) {
										handleError(res, err);
									} else {
										savedUserWithStripeCustomerID.stripeSubscriptionID = subscription.id;
										savedUserWithStripeCustomerID.save(finalUserSavedWithSubscription => {
											if (!sixMonthCommitment) {
												stripe.charges.create(
													{
														amount: 20000,
														currency: stripePlan.currency,
														customer: savedUserWithStripeCustomerID.stripeCustomerID,
														description: "Onboarding fee"
													},
													function(err, charge) {
														if (err) {
															handleError(res, err);
														} else {
															res.send(true);
														}
													}
												);
											} else {
												res.send(true);
											}
										});
									}
								}
							);
						});
					}
				});
			}
		}
	);
}
