const request = require("request");
const cheerio = require("cheerio");
const cloudinary = require("cloudinary");
const moment = require("moment-timezone");

const Post = require("../models/Post");
const User = require("../models/User");
const Email = require("../models/Email");
const Account = require("../models/Account");
const Calendar = require("../models/Calendar");

const deletePostStandalone = (req, callback) => {
  // function called indirectly when deleting a post normally
  // called directly (with skipUserCheck = true) when deleting an entire calendar
  // we skip the user checks in that case bcz the user would have already been cleared to delete the calendar
  const { postID, skipUserCheck } = req;
  let userID = req.user._id;
  if (req.user.signedInAsUser) {
    if (req.user.signedInAsUser.id) {
      userID = req.user.signedInAsUser.id;
    }
  }
  Post.findOne({ _id: postID }, async function(err, post) {
    if (post && !err) {
      if (!skipUserCheck) {
        // need to make sure the user has the right to delete this post
        let invalidUser = false;
        await Calendar.findOne(
          { _id: post.calendarID, userIDs: userID },
          (err, foundCalendar) => {
            if (err) {
              invalidUser = true;
              callback({
                success: false,
                err,
                message: `Error while looking up calendar's user list.`
              });
            } else if (!foundCalendar) {
              invalidUser = true;
              callback({
                success: false,
                message: `User is not a valid member of the calendar so cannot delete this post.`
              });
            }
          }
        );
        if (invalidUser) return;
      }
      if (post.images) {
        for (let i = 0; i < post.images.length; i++) {
          await cloudinary.uploader.destroy(post.images[i].publicID, function(
            result
          ) {
            // TO DO: handle error here
          });
        }
      }
      post.remove().then(result => {
        callback({ success: true });
      });
    } else callback({ success: false, err });
  });
};

module.exports = {
  deleteFile: function(req, res) {
    cloudinary.uploader.destroy(req.params.publicID, function(result) {
      res.send(true);
      // TO DO: handle error here
    });
  },
  getImagesFromUrl: function(req, res) {
    let url = req.body.link;

    request(url, function(err, result, body) {
      if (err) {
        console.log(err);
        res.send(false);
        return;
      }
      let imgSrc = [];
      if (!body) {
        console.log("No images found");
        res.send(false);
        return;
      }
      let $ = cheerio.load(body);
      $("img").each(function(index, img) {
        imgSrc.push(img.attribs.src);
      });

      res.send(imgSrc);
    });
  },
  savePost: function(req, res) {
    let post = req.body;

    Calendar.findOne({ _id: post.calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: "Error while looking up calendar in the database."
        });
      } else {
        Post.findOne({ _id: post._id }, function(err, foundPost) {
          let newPost = new Post();

          if (err) {
            console.log(err);
            res.send(false);
            return;
          } else if (foundPost) {
            newPost = foundPost;
          }

          let userID = req.user._id;
          if (req.user.signedInAsUser) {
            if (req.user.signedInAsUser.id) {
              userID = req.user.signedInAsUser.id;
            }
          }
          // Set color of post
          let backgroundColorOfPost;
          if (post.socialType === "facebook") {
            backgroundColorOfPost = "#4267b2";
          } else if (post.socialType === "twitter") {
            backgroundColorOfPost = "#1da1f2";
          } else if (post.socialType === "linkedin") {
            backgroundColorOfPost = "#0077b5";
          } else if (post.socialType === "instagram") {
            backgroundColorOfPost = "#cd486b";
          } else if (post.socialType === "custom") {
            backgroundColorOfPost = "var(--seven-purple-color)";
          }

          let emailReminder;
          if (post.sendEmailReminder && !newPost.emailReminder) {
            emailReminder = new Email({ userID, postID: post._id });
            emailReminder.save();
          }

          newPost.userID = userID;
          newPost.color = backgroundColorOfPost;
          newPost.emailReminder = emailReminder;
          if (post.socialType !== "custom") {
            newPost.status = "pending";
          }

          for (let index in post) {
            newPost[index] = post[index];
          }
          if (!foundPost) {
            // post doesn't exist in DB yet so we need to make sure the calendar is eligible to have posts saved
            if (foundCalendar.postsLeft !== -1) {
              // calendar is not unlocked so we need to check how many posts are currently scheduled on it
              Post.find(
                { calendarID: foundCalendar._id, status: "pending" },
                (err, foundPosts) => {
                  if (err || !foundPosts) {
                    res.send({
                      success: false,
                      err,
                      message:
                        "Error while checking how many more posts this demo calendar can schedule."
                    });
                  } else {
                    if (foundCalendar.postsLeft <= foundPosts.length) {
                      res.send({
                        success: false,
                        message:
                          "Demo calendar has already reached its maximum number of posts. Upgrade your account to unlock your calendar's post limit."
                      });
                    } else {
                      newPost
                        .save()
                        .then(result =>
                          res.send({ success: true, post: result })
                        );
                    }
                  }
                }
              );
            } else {
              // calendar is unlocked so we can just save the post
              newPost
                .save()
                .then(result => res.send({ success: true, post: result }));
            }
          } else {
            // post already exists in DB so we can just save it
            newPost
              .save()
              .then(result => res.send({ success: true, post: result }));
          }
        });
      }
    });
  },
  getPost: function(req, res) {
    Post.findOne({ _id: req.params.postID }, function(err, post) {
      if (err) res.send({ success: false, err });
      else res.send({ success: true, post });
    });
  },
  uploadPostImages: function(req, res) {
    let postID = req.body.postID;
    let { images } = req.body;

    Post.findOne({ _id: postID }, async function(err, post) {
      if (err) {
        console.log(err);
        res.send(false);
        return;
      }
      // There are multiple files
      for (let index in images) {
        // Must be await so results are not duplicated
        await cloudinary.v2.uploader.upload(images[index], function(
          error,
          result
        ) {
          post.images.push({
            url: result.url,
            publicID: result.public_id
          });
        });
      }
      post.save().then(result => res.send(true));
    });
  },
  deletePostImages: async function(req, res) {
    let deleteImagesArray = req.body;
    // Delete images from cloudinary
    for (let i = 0; i < deleteImagesArray.length; i++) {
      await cloudinary.uploader.destroy(deleteImagesArray[i].publicID, function(
        result
      ) {
        // TO DO: handle error here
      });
    }
    Post.findOne({ _id: req.params.postID }, function(err, post) {
      for (let i = 0; i < post.images.length; i++) {
        for (let j = 0; j < deleteImagesArray.length; j++) {
          if (post.images[i].publicID === deleteImagesArray[j].publicID) {
            post.images.splice(i, 1);
          }
        }
      }
      post.save().then(result => res.send(true));
    });
  },
  deletePost: function(req, res) {
    deletePostStandalone(
      { postID: req.params.postID, user: req.user },
      result => res.send(result)
    );
  },
  deletePostStandalone
};
