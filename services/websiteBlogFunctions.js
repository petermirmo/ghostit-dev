var request = require("request");
var fs = require("fs");
const Blog = require("../models/Blog");

var cloudinary = require("cloudinary");

module.exports = {
	saveBlog: function(req, res) {
		let userID = req.user._id;
		if (req.user.signedInAsUser) {
			if (req.user.signedInAsUser.id) {
				userID = req.user.signedInAsUser.id;
			}
		}

		Blog.findOne({ _id: req.params.blogID }, async function(err, foundBlog) {
			if (err) {
				handleError(res, err);
				return;
			}

			let newBlog;
			let { blog, blogFile, blogImages, blogFileName } = req.body;

			if (foundBlog) {
				newBlog = foundBlog;
				newBlog.postingDate = blog.postingDate;
				newBlog.dueDate = blog.dueDate;
				newBlog.title = blog.title;
				newBlog.resources = blog.resources;
				newBlog.about = blog.about;
				newBlog.eventColor = blog.eventColor;
				newBlog.image = blog.image;
				newBlog.wordDoc = blog.wordDoc;
				newBlog.keywords = blog.keywords;
			} else {
				newBlog = new Blog(blog);
			}
			newBlog.userID = userID;

			if (blogFile.localPath) {
				// Delete old wordDoc
				if (newBlog.wordDoc.publicID) {
					await cloudinary.uploader.destroy(
						newBlog.wordDoc.publicID,
						function(result) {
							if (result.error) {
								handleError(res, result);
								return;
							}
						},
						{ resource_type: "raw" }
					);
				}
				// Upload new file
				await cloudinary.v2.uploader.upload(blogFile.localPath, { resource_type: "raw" }, function(error, result) {
					if (error) {
						handleError(res, error);
						return;
					}
					newBlog.wordDoc = { url: result.url, publicID: result.public_id, name: blogFileName };
				});
			}

			if (blogImages.length !== 0) {
				// Delete old image
				if (newBlog.image.publicID) {
					await cloudinary.uploader.destroy(newBlog.image.publicID, function(result) {
						if (result.error) {
							handleError(res, result);
							return;
						}
					});
				}

				// Upload new image
				await cloudinary.v2.uploader.upload(blogImages[0].imagePreviewUrl, function(error, result) {
					if (error) {
						handleError(res, error);
						return;
					}
					newBlog.image = { url: result.url, publicID: result.public_id };
				});
			}

			newBlog.save().then(result => {
				res.send(true);
			});
		});
	},
	getBlogs(req, res) {
		let userID = req.user._id;
		if (req.user.signedInAsUser) {
			if (req.user.signedInAsUser.id) {
				userID = req.user.signedInAsUser.id;
			}
		}
		Blog.find({ userID: userID }, function(err, blogs) {
			if (err) {
				res.send(false);
			}
			res.send(blogs);
		});
	},
	deleteBlog(req, res) {
		Blog.findOne({ _id: req.params.blogID }, async function(err, blog) {
			if (err) {
				handleError(res, err);
			} else if (blog) {
				if (blog.userID === req.user._id || req.user.role === "admin" || req.user.role === "manager") {
					if (blog.wordDoc.publicID) {
						await cloudinary.uploader.destroy(
							blog.wordDoc.publicID,
							function(error) {
								if (error) {
									console.log(error);
								}
							},
							{ resource_type: "raw" }
						);
					}
					if (blog.image.publicID) {
						await cloudinary.uploader.destroy(blog.image.publicID, function(error) {
							// TO DO: handle error here
							if (error) {
								console.log(error);
							}
						});
					}
					blog.remove().then(result => {
						res.send(true);
					});
				} else {
					handleError(res, "Hacker trying to delete posts");
				}
			} else {
				handleError(res, "Blog not found");
			}
		});
	}
};
function handleError(res, errorMessage) {
	console.log(errorMessage);
	res.send(false);
	return;
}
