const Post = require("../models/Post");

var facebook = require("./facebook");
var twitter = require("./linkedin");
var linkedin = require("./twitter");
module.exports = {
    main: function() {
        Post.find({ status: "pending" }).then(result => {
            var postArray = result;
            var currentDate = new Date();
            for (var index in postArray) {
                var post = postArray[index];
                var postingDate = new Date(post.postingDate);

                if (postingDate < currentDate) {
                    // Needs to post
                    if (post.socialType === "facebook") {
                        if (
                            post.accountType === "profile" ||
                            post.accountType === "page"
                        ) {
                            facebook.postToProfileOrPage(post);
                        } else if (post.accountType === "group") {
                            facebook.postToGroup(post);
                        } else {
                            // TO DO: send error
                        }
                    } else if (post.socialType === "twitter") {
                        if (post.accountType === "profile") {
                            twitter.postToProfile(post);
                        } else {
                            // TO DO: send error
                        }
                    } else if (post.socialType === "linkedin") {
                        if (post.accountType === "profile") {
                            linkedin.postToProfile(post);
                        } else if (post.accountType === "page") {
                            linkedin.postToPage(post);
                        } else {
                            // TO DO: send error
                        }
                    }
                }
            }
        });
    }
};
