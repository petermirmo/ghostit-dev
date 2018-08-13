const User = require("../models/User");
const Post = require("../models/Post");
const Blog = require("../models/Blog");
const Newsletter = require("../models/Newsletter");
const Campaign = require("../models/Campaign");

module.exports = socket => {
	socket.on("new_campaign", campaign => {
		new Campaign(campaign).save((err, result) => {
			if (!err) {
				socket.emit("new_campaign_saved", result._id);
			}
		});
	});

	socket.on("new_post", emitObject => {
		let { campaign, post } = emitObject;
		Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
			if (foundCampaign) {
				foundCampaign.posts.push(post._id);
				foundCampaign.save((err, savedCampaign) => {
					if (savedCampaign) socket.emit("post_added", { campaignPosts: savedCampaign.posts });
				});
			}
		});
	});

	socket.on("campaign_editted", campaign => {
		Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
			if (foundCampaign) {
				foundCampaign.name = campaign.name;
				foundCampaign.startDate = campaign.startDate;
				foundCampaign.endDate = campaign.endDate;
				foundCampaign.color = campaign.color;
				foundCampaign.save((err, result) => {
					socket.emit("campaign_saved", { campaign: result });
				});
			}
		});
	});

	socket.on("close", campaign => {
		if (campaign.posts) {
			if (campaign.posts.length === 0) {
				Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
					if (foundCampaign) foundCampaign.remove();
					socket.disconnect();
				});
			}
		} else {
			Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
				if (foundCampaign) foundCampaign.remove();
				socket.disconnect();
			});
		}
	});

	socket.on("delete", campaign => {
		Campaign.findOne({ _id: campaign._id }, (err, foundCampaign) => {
			if (foundCampaign) {
				if (foundCampaign.posts) {
					for (let index = 0; index < foundCampaign.posts.length; index++) {
						let post = foundCampaign.posts[index];

						Post.findOne({ _id: post._id }, (err, foundPost) => {
							if (foundPost) foundPost.remove();
						});
					}
				}
				foundCampaign.remove();
			}
		});
	});

	socket.on("disconnect", function() {});
};
