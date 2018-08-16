const moment = require("moment-timezone");
const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Recipe = require("../models/Recipe");
const Post = require("../models/Post");

module.exports = {
	getCampaigns: function(req, res) {
		// Get all posts for user
		let userID = req.user._id;
		if (req.user.signedInAsUser) {
			if (req.user.signedInAsUser.id) {
				userID = req.user.signedInAsUser.id;
			}
		}

		Campaign.find({ userID: userID }, async (err, campaigns) => {
			if (err) res.send({ error: err });
			var campaignArray = [];

			if (campaigns.length != 0) {
				for (let index in campaigns) {
					let campaign = campaigns[index];
					await Post.find({ _id: { $in: campaign.posts } }, (err, posts) => {
						campaignArray.push({ campaign, posts });
						if (index == campaigns.length - 1) res.send({ campaignArray });
					});
				}
			} else res.send({ campaignArray: [] });
		});
	},
	getRecipes: function(req, res) {
		let userID = req.user._id;
		if (req.user.signedInAsUser) {
			if (req.user.signedInAsUser.id) {
				userID = req.user.signedInAsUser.id;
			}
		}
		Recipe.find({}, (err, allRecipes) => {
			Recipe.find({ userID }, (err, usersRecipes) => {
				res.send({ usersRecipes, allRecipes });
			});
		});
	},
	saveRecipe: function(req, res) {
		let userID = req.user._id;
		if (req.user.signedInAsUser) {
			if (req.user.signedInAsUser.id) {
				userID = req.user.signedInAsUser.id;
			}
		}

		let { campaign, posts } = req.body;
		let recipe = new Recipe();

		recipe.userID = userID;
		recipe.name = campaign.name;
		recipe.color = campaign.color;
		recipe.length = new moment(campaign.endDate).diff(new moment(campaign.startDate));
		recipe.hour = new moment(campaign.startDate).format("hh");
		recipe.minute = new moment(campaign.startDate).format("mm");
		recipe.posts = [];

		for (let index in posts) {
			let post = posts[index];
			recipe.posts.push({
				socialType: post.socialType,
				instructions: post.instructions,
				postingDate: new moment(post.post.postingDate).diff(new moment(campaign.startDate))
			});
		}
		Campaign.findOne({ _id: campaign._id }, function(err, foundCampaign) {
			foundCampaign.recipeID = recipe._id;
			foundCampaign.save();
		});

		recipe.save();

		res.send({ success: true });
	}
};
