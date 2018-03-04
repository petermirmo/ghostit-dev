var request = require("request");
var cheerio = require("cheerio");
const Post = require("../models/Post");
const PostImage = require("../models/PostImage");

module.exports = {
    getImagesFromUrl: function(req, res) {
        var url = req.body.link;
        request(url, function(err, result, body) {
            if (err) throw err;
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
        newPost.link = post.link;
        newPost.linkImage = post.linkImage;
        newPost.save().then(result => res.send(result));
    },
    savePostImages: function(req, res) {
        var imagesArray = req.files.file;
        var postID = req.body.postID;
        // Check if one image is being uploaded or many
        // If it is just one image then imagesArray will be an object not an array
        if (Array.isArray(imagesArray)) {
            // Loop through each image
            for (var index in imagesArray) {
                let image = imagesArray[index];
                console.log(image);
            }
        } else {
            // fileArray is an object not an array, because there is only one element
            var image = imagesArray;

            var newImage = new PostImage();
            newImage.postID = postID;
            newImage.name = image.name;
            newImage.data = image.data;
            newImage.save();
        }
    }
};
