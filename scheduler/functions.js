//const { sendEmail } = require("../MailFiles/sendEmail");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");

module.exports = {
  savePostError: (postID, error) => {
    Post.findOne({ _id: postID }, (err, post) => {
      if (post) {
        console.log(error);

        let notification = new Notification();
        notification.userID = "5af9f5ebf7bdf40f7802a1c6";
        //5acfa9409f3e9e06ac173d26
        notification.title =
          "Oh no! Your " +
          post.socialType +
          " session with Ghostit has ended. Please reconnect this account as soon as possible so there are no more interuptions in your social media posting.";

        User.findOne({ _id: post.userID }, (err, user) => {
          if (user) {
            notification.message =
              "User's ID: " + user._id + " user's name: " + user.fullName;

            /*
            sendEmail(
              user,
              "Ghostit Notification",
              notification.title,
              returnObject => {
                return returnObject;
              }
            );*/ notification.save();
          }
        });
      }
      post.status = "error";
      post.errorMessage = JSON.stringify(error);
      post.save().then(response => {
        return;
      });
    });
  },
  savePostSuccessfully: (postID, socialMediaPostID) => {
    Post.findOne({ _id: postID }, (err, result) => {
      result.status = "posted";
      result.socialMediaID = socialMediaPostID;
      result.save().then(response => {
        return;
      });
    });
  }
};
