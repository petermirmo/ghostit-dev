const User = require("../models/User");
const Post = require("../models/Post");
const Blog = require("../models/Blog");
const Newsletter = require("../models/Newsletter");
const Campaign = require("../models/Campaign");

module.exports = socket => {
	socket.on("new_campaign", function(campaign) {
		new Campaign(campaign).save(function(err, result) {
			if (!err) {
				socket.emit("campaign_saved", result);
			}
		});
	});

	socket.on("post_added", function(emitObject) {});

	socket.on("disconnect", function() {});

	socket.on("user_reported", function() {});
};
