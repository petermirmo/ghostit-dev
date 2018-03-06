var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

const Post = require("../models/Post");

module.exports = {
    getImagesFromUrl: function(req, res) {
        var url = req.body.link;
        request(url, function(err, result, body) {
            if (err) res.send();
            var imgSrc = [];
            var $ = cheerio.load(body);
            $("img").each(function(index, img) {
                imgSrc.push(img.attribs.src);
            });
            res.send(imgSrc);
        });
    },
    savePost: function(req, res) {
        var post = req.body;
        var newPost = new Post();
        newPost.userID = req.user.id;
        newPost.accountID = post.accountID;
        newPost.content = post.content;
        newPost.postingDate = post.postingDate;
        newPost.link = post.link;
        newPost.linkImage = post.linkImage;
        newPost.accountType = post.accountType;
        newPost.socialType = post.socialType;
        newPost.save().then(result => res.send(result));
    },
    savePostImages: function(req, res) {
        // All logic is done in the multar storage at the top of apiRoutes
        res.send(true);
    },
    getPosts: function(req, res) {
        // Get all posts for user
        Post.find({ userID: req.user.id }, function(err, posts) {
            if (err) return handleError(err);

            res.send(posts);
        });
    },
    getPost: function(req, res) {
        Post.findOne({ _id: req.params.postID }, function(err, post) {
            res.send(post);
        });
    },
    updatePost: function(req, res) {
        Post.findOne({ _id: req.params.postID }, function(err, post) {
            if (err) return handleError(err);
            var edittedPost = req.body;
            post.accountID = edittedPost.accountID;
            post.content = edittedPost.content;
            post.postingDate = edittedPost.postingDate;
            post.link = edittedPost.link;
            post.linkImage = edittedPost.linkImage;
            post.accountType = edittedPost.accountType;
            post.socialType = edittedPost.socialType;
            post.save().then(post => res.send(post));
        });
    }
};
