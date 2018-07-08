const User = require("../models/User");
const Post = require("../models/Post");
const Blog = require("../models/Blog");
const Newsletter = require("../models/Newsletter");

module.exports = socket => {
	socket.on("new_campaign", function(emitObject) {
		console.log(emitObject);
	});

	socket.on("post_added", function(emitObject) {});

	socket.on("disconnect", function() {});

	socket.on("user_reported", function() {});
};
