const Post = require("../models/Post");
var FB = require("fb");
const Account = require("../models/Account");
var cloudinary = require("cloudinary");

module.exports = {
    postToProfileOrPage: function(post) {
        Account.findOne(
            {
                _id: post.accountID
            },
            async function(err, account) {
                if (err) return console.log(err);
                if (account) {
                    // Use facebook profile access token to get account groups
                    FB.setAccessToken(account.accessToken);
                    if (post.images.length !== 0) {
                        return;
                        var facebookPostWithImage = {};
                        // Set non-null information to facebook post
                        if (post.content !== "") {
                            facebookPostWithImage.caption = post.content;
                        }
                        for (var i = 0; i < post.images.length; i++) {
                            facebookPostWithImage.url = post.images[i].imageURL;
                            FB.api(
                                "me/photos",
                                "post",
                                facebookPostWithImage,
                                function(res) {
                                    if (!res || res.error) {
                                        savePostError(post._id, res.error);
                                    } else {
                                        savePostSuccessfully(
                                            post._id,
                                            res.post_id
                                        );
                                    }
                                }
                            );
                        }
                    } else {
                        return;
                        var facebookPostNoImage = {};
                        // Set non-null information to facebook post
                        if (post.content !== "") {
                            facebookPostNoImage.message = post.content;
                        }
                        if (post.link !== "") {
                            facebookPostNoImage.link = post.link;
                        }
                        FB.api("me/feed", "post", facebookPostNoImage, function(
                            res
                        ) {
                            if (!res || res.error) {
                                savePostError(post._id, res.error);
                            } else {
                                savePostSuccessfully(post._id, res.post_id);
                            }
                        });
                    }
                } else {
                    savePostError(post._id, "Account not found!");
                }
            }
        );
    },
    postToGroup: function(post) {
        Account.findOne(
            {
                _id: post.accountID
            },
            async function(err, account) {
                if (err) return console.log(err);
                if (account) {
                    // Use facebook profile access token to get account groups
                    FB.setAccessToken(account.accessToken);

                    if (post.images.length !== 0) {
                        var facebookPostWithImage = {};
                        // Set non-null information to facebook post
                        if (post.content !== "") {
                            facebookPostWithImage.message = post.content;
                        }
                        for (var i = 0; i < post.images.length; i++) {
                            facebookPostWithImage.link =
                                post.images[i].imageURL;
                            FB.api(
                                "/" + account.socialID + "/feed",
                                "post",
                                facebookPostWithImage,
                                function(res) {
                                    console.log(res);
                                    if (!res || res.error) {
                                        savePostError(post._id, res.error);
                                    } else {
                                        savePostSuccessfully(post._id, res.id);
                                    }
                                }
                            );
                        }
                    } else {
                        var facebookPostNoImage = {};
                        // Set non-null information to facebook post
                        if (post.content !== "") {
                            facebookPostNoImage.message = post.content;
                        }
                        if (post.link !== "") {
                            facebookPostNoImage.link = post.link;
                        }
                        FB.api(
                            "/" + account.socialID + "/feed",
                            "post",
                            facebookPostNoImage,
                            function(res) {
                                if (!res || res.error) {
                                    savePostError(post._id, res.error);
                                } else {
                                    savePostSuccessfully(post._id, res.id);
                                }
                            }
                        );
                    }
                } else {
                    savePostError(post._id, "Account not found!");
                }
            }
        );
    }
};
function savePostError(postID, error) {
    Post.findOne({ _id: postID }, function(err, post) {
        post.status = "error";
        post.errorMessage = JSON.stringify(error);
        post.save().then(response => {
            return;
        });
    });
}
function savePostSuccessfully(postID, fbPostID) {
    Post.findOne({ _id: postID }, function(err, result) {
        result.status = "posted";
        result.socialMediaID = fbPostID;
        result.save().then(response => {
            return;
        });
    });
}
