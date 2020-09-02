const moment = require("moment-timezone");
const cloudinary = require("cloudinary");

const User = require("../models/User");
const GhostitBlog = require("../models/GhostitBlog");

const { handleError } = require("./generalFunctions");

const { whatFileTypeIsString } = require("../util");

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
          (cloudinaryResult) => {}
        );
      }
    }
    const images = [];
    const pureContentArray = [];
    const { authorID, category, contentArray, url } = ghostitBlog;

    for (let index = 0; index < contentArray.length; index++) {
      const content = contentArray[index];
      if (!content) continue;

      content.location = index;
      if (content.size) images.push(content);
      else pureContentArray.push(content);
    }

    let newGhostitBlog = {};
    if (!ghostitBlog.id) newGhostitBlog = new GhostitBlog(ghostitBlog);

    newGhostitBlog.authorID = authorID;
    newGhostitBlog.images = [];
    newGhostitBlog.userID = user._id;
    newGhostitBlog.url = url;
    newGhostitBlog.category = category;
    newGhostitBlog.contentArray = pureContentArray;

    let saveBlog = (blog) => {
      let unsuccessfulSave = (blog, error) => {
        // Make sure images are deleted from cloudinary if save was not successful
        let asyncCounter = 0;

        if (blog.images) {
          blog.images.forEach((image) => {
            asyncCounter++;

            cloudinary.uploader.destroy(
              image.publicID,
              (cloudinaryResult) => {
                asyncCounter--;

                if (asyncCounter === 0) handleError(res, error);
              },
              { resource_type: whatFileTypeIsString(image.url) }
            );
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

    if (images.length !== 0) {
      let asyncCounter = 0;
      let continueCounter = images.length;

      for (let index in images) {
        asyncCounter++;

        const image = images[index];

        if (image.url) {
          asyncCounter--;
          continueCounter--;
          newGhostitBlog.images.push(image);
          if (continueCounter === 0) saveBlog(newGhostitBlog);

          continue;
        } else {
          cloudinary.v2.uploader.upload(
            image.file,
            { resource_type: whatFileTypeIsString(image.type) },
            (error, result) => {
              if (error) {
                if (asyncCounter === 0) return handleError(res, error);
                else handleError(undefined, error);
              } else {
                asyncCounter--;
                newGhostitBlog.images.push({
                  url: result.secure_url,
                  publicID: result.public_id,
                  size: image.size,
                  location: image.location,
                  alt: image.alt,
                });

                if (asyncCounter === 0) saveBlog(newGhostitBlog);
              }
            }
          );
        }
      }
    } else {
      saveBlog(newGhostitBlog);
    }
  },
  getGhostitBlogs: (req, res) => {
    const { skip } = req.body;

    GhostitBlog.find({}, (err, ghostitBlogs) => {
      if (!err && ghostitBlogs) res.send({ success: true, ghostitBlogs });
      else handleError(res, err);
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
  },
  getTeamMemberGhostitBlogs: (req, res) => {
    GhostitBlog.find({ authorID: req.params.authorID }, (err, ghostitBlogs) => {
      if (!err && ghostitBlogs) res.send({ success: true, ghostitBlogs });
      else handleError(res, err);
    });
  },
  getGhostitBlog: (req, res) => {
    GhostitBlog.findOne({ url: req.params.url }, (err, ghostitBlog) => {
      if (!err && ghostitBlog) res.send({ success: true, ghostitBlog });
      else handleError(res, err);
    });
  },
};
