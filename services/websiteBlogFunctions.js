const request = require("request");
const fs = require("fs");
const cloudinary = require("cloudinary");

const Blog = require("../models/Blog");

const generalFunctions = require("./generalFunctions");

const deleteBlogStandalone = (blogID, callback) => {
  // function called when calendar gets deleted and blogs within the calendar must be deleted first
  Blog.findOne({ _id: blogID }, async (err, blog) => {
    if (err || !blog) callback({ success: false, err });
    else {
      if (blog.wordDoc.publicID) {
        await cloudinary.uploader.destroy(
          blog.wordDoc.publicID,
          error => {
            // handle error
          },
          { resource_type: "raw" }
        );
      }
      if (blog.image.publicID) {
        await cloudinary.uploader.destroy(blog.image.publicID, function(error) {
          // handle error
        });
      }
      blog.remove();
      callback({ success: true });
    }
  });
};

module.exports = {
  saveBlog: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Blog.findOne({ _id: req.body.blog._id }, async (err, foundBlog) => {
      if (err) return generalFunctions.handleError(res, err);
      else {
        let newBlog;
        let { blog, blogFile, blogImages, blogFileName } = req.body;

        if (foundBlog) {
          newBlog = foundBlog;
          newBlog.postingDate = blog.postingDate;
          newBlog.dueDate = blog.dueDate;
          newBlog.title = blog.title;
          newBlog.resources = blog.resources;
          newBlog.about = blog.about;
          newBlog.image = blog.image;
          newBlog.wordDoc = blog.wordDoc;
          newBlog.keywords = blog.keywords;
        } else {
          newBlog = new Blog(blog);
        }
        newBlog.userID = userID;
        newBlog.socialType = "blog";
        newBlog.color = "#e74c3c";

        if (blogFile.localPath) {
          // Delete old wordDoc
          if (newBlog.wordDoc.publicID) {
            await cloudinary.uploader.destroy(
              newBlog.wordDoc.publicID,
              result => {
                if (result.error)
                  return generalFunctions.handleError(res, result.error);
              },
              { resource_type: "raw" }
            );
          }

          // Upload new file
          await cloudinary.v2.uploader.upload(
            blogFile.localPath,
            { resource_type: "raw", public_id: blogFileName },
            (error, result) => {
              if (error) return generalFunctions.handleError(res, result.error);
              else {
                newBlog.wordDoc = {
                  url: result.url,
                  publicID: result.public_id,
                  name: blogFileName
                };
              }
            }
          );
        }

        if (blogImages.length !== 0) {
          // Delete old image
          if (newBlog.image.publicID) {
            await cloudinary.uploader.destroy(
              newBlog.image.publicID,
              result => {
                if (result.error)
                  return generalFunctions.handleError(res, result.error);
              }
            );
          }

          // Upload new image
          await cloudinary.v2.uploader.upload(
            blogImages[0].imagePreviewUrl,
            (error, result) => {
              if (error) return generalFunctions.handleError(res, error);
              else
                newBlog.image = { url: result.url, publicID: result.public_id };
            }
          );
        }

        newBlog.save().then(result => {
          res.send({ success: true });
        });
      }
    });
  },
  getBlogs(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Blog.find({ userID }, (err, blogs) => {
      if (err) generalFunctions.handleError(res, err);
      else res.send({ success: true, blogs });
    });
  },
  deleteBlog(req, res) {
    Blog.findOne({ _id: req.params.blogID }, async (err, blog) => {
      if (err) generalFunctions.handleError(res, err);
      else if (blog) {
        if (
          blog.userID === req.user._id ||
          req.user.role === "admin" ||
          req.user.role === "manager"
        ) {
          if (blog.wordDoc.publicID) {
            await cloudinary.uploader.destroy(
              blog.wordDoc.publicID,
              error => {
                if (error) generalFunctions.handleError(res, error);
              },
              { resource_type: "raw" }
            );
          }
          if (blog.image.publicID) {
            await cloudinary.uploader.destroy(blog.image.publicID, function(
              error
            ) {
              if (error) generalFunctions.handleError(res, error);
            });
          }
          blog.remove().then(result => {
            res.send({ success: true });
          });
        } else
          generalFunctions.handleError(res, "Hacker trying to delete posts");
      } else generalFunctions.handleError(res, "Blog not found");
    });
  },
  deleteBlogStandalone
};
