const User = require("../models/User");
const Campaign = require("../models/Campaign");
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
	}
};
