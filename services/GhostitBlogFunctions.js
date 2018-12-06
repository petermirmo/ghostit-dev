const moment = require("moment-timezone");
const cloudinary = require("cloudinary");

const User = require("../models/User");
const GhostitBlog = require("../models/GhostitBlog");

const { handleError } = require("./generalFunctions");

module.exports = {
  saveGhostitBlog: (req, res) => {
    let user = req.user;
    let ghostitBlog = req.body;

    if (user.role !== "admin") {
      res.send({ success: false });
      return;
    }

    let newGhostitBlog = new GhostitBlog(ghostitBlog);
    newGhostitBlog.images = [];
    newGhostitBlog.userID = user._id;

    let saveBlog = blog => {
      blog.save((error, result) => {
        if (!error && result) res.send({ success: true });
        else {
          let asyncCounter = 0;

          if (blog.images) {
            blog.images.forEach(image => {
              asyncCounter++;

              cloudinary.uploader.destroy(image.publicID, cloudinaryResult => {
                asyncCounter--;

                if (asyncCounter === 0) res.send({ success: false, error });
              });
            });
          } else res.send({ success: false, error });
        }
      });
    };

    if (ghostitBlog.images.length != 0) {
      let asyncCounter = 0;

      for (let index in ghostitBlog.images) {
        asyncCounter++;

        let image = ghostitBlog.images[index];
        cloudinary.v2.uploader.upload(
          image.imagePreviewUrl,
          (error, result) => {
            if (error) return handleError(res, error);
            else {
              asyncCounter--;
              newGhostitBlog.images.push({
                url: result.url,
                publicID: result.public_id,
                size: image.size,
                location: image.location
              });

              if (asyncCounter === 0) {
                saveBlog(newGhostitBlog);
              }
            }
          }
        );
      }
    } else {
      saveBlog(newGhostitBlog);
    }
  },
  getGhostitBlogs: (req, res) => {
    GhostitBlog.find({}, { title: 1, images: 1 }, (err, ghostitBlogs) => {
      if (!err && ghostitBlogs) res.send({ success: true, ghostitBlogs });
      else res.send({ success: false });
    });
  },
  getGhostitBlog: (req, res) => {
    GhostitBlog.find({ _id: req.params.id }, (err, ghostitBlog) => {
      if (!err && ghostitBlog) res.send({ success: true, ghostitBlog });
      else res.send({ success: false });
    });
  }
};
