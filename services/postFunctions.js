var request = require("request");
var cheerio = require("cheerio");

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
        res.send(true);
    },
    getPosts: function(req, res) {
        // Get all posts
        Post.find({ userID: req.user.id }, function(err, posts) {
            if (err) return handleError(err);

            res.send(posts);
        });
    },
    getPost: function(req, res) {
        Post.findOne({ _id: req.params.postID }, function(err, post) {
            console.log(post);
        });
    },
    getImages: function(req, res) {}
};
