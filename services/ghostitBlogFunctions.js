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
    if (ghostitBlog.deleteImageArray) {
      for (let index in ghostitBlog.deleteImageArray) {
        cloudinary.uploader.destroy(
          ghostitBlog.deleteImageArray[index],
          cloudinaryResult => {}
        );
      }
    }
    const images = [];
    const contentArray = [];
    for (let index = 0; index < ghostitBlog.contentArray.length; index++) {
      ghostitBlog.contentArray[index].location = index;
      if (ghostitBlog.contentArray[index].size)
        images.push(ghostitBlog.contentArray[index]);
      else contentArray.push(ghostitBlog.contentArray[index]);
    }
    ghostitBlog.images = images;
    ghostitBlog.contentArray = contentArray;

    let newGhostitBlog = {};
    if (!ghostitBlog.id) newGhostitBlog = new GhostitBlog(ghostitBlog);

    newGhostitBlog.images = [];
    newGhostitBlog.userID = user._id;
    newGhostitBlog.url = ghostitBlog.url;
    newGhostitBlog.category = ghostitBlog.category;
    newGhostitBlog.contentArray = ghostitBlog.contentArray;

    let saveBlog = blog => {
      let unsuccessfulSave = (blog, error) => {
        // Make sure images are deleted from cloudinary if save was not successful
        let asyncCounter = 0;

        if (blog.images) {
          blog.images.forEach(image => {
            asyncCounter++;

            cloudinary.uploader.destroy(image.publicID, cloudinaryResult => {
              asyncCounter--;

              if (asyncCounter === 0) handleError(res, error);
            });
          });
        } else handleError(res, error);
      };

      if (ghostitBlog.id) {
        GhostitBlog.updateOne(
          { _id: ghostitBlog.id },
          newGhostitBlog,
          undefined,
          (error, result) => {
            if (!error && result) res.send({ success: true });
            else unsuccessfulSave(blog, error);
          }
        );
      } else {
        blog.save((error, result) => {
          if (!error && result)
            res.send({ success: true, ghostitBlog: result });
          else {
            unsuccessfulSave(blog, error);
          }
        });
      }
    };

    if (ghostitBlog.images.length != 0) {
      let asyncCounter = 0;
      let continueCounter = ghostitBlog.images.length;

      for (let index in ghostitBlog.images) {
        asyncCounter++;

        let image = ghostitBlog.images[index];

        if (image.url) {
          asyncCounter--;
          continueCounter--;
          newGhostitBlog.images.push(image);
          if (continueCounter === 0) saveBlog(newGhostitBlog);

          continue;
        } else
          cloudinary.v2.uploader.upload(
            image.file,
            (error, result) => {
              if (error) return handleError(res, error);
              else {
                asyncCounter--;
                newGhostitBlog.images.push({
                  url: result.secure_url,
                  publicID: result.public_id,
                  size: image.size,
                  location: image.location,
                  alt: image.alt
                });

                if (asyncCounter === 0) saveBlog(newGhostitBlog);
              }
            }
          );
      }
    } else {
      saveBlog(newGhostitBlog);
    }
  },
  getGhostitBlogs: (req, res) => {
    GhostitBlog.find({}, (err, ghostitBlogs) => {
      if (!err && ghostitBlogs) res.send({ success: true, ghostitBlogs });
      else handleError(res, err);
    }).sort({ createdAt: -1 });
  },
  getGhostitBlog: (req, res) => {
    GhostitBlog.findOne({ _id: req.params.blogID }, (err, ghostitBlog) => {
      if (!err && ghostitBlog) res.send({ success: true, ghostitBlog });
      else handleError(res, err);
    });
  }
};
