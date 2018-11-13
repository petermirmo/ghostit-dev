const { sendEmail } = require("../MailFiles/sendEmail");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");

module.exports = {
  savePostError: (postID, error) => {
    Post.findOne({ _id: postID }, (err, post) => {
      if (post) {
        let notification = new Notification();
        notification.userID = post.userID;
        notification.title =
          "Oh no! Your " +
          post.socialType +
          " session with Ghostit has ended. Please reconnect this account as soon as possible so there are no more interuptions in your social media posting.";
        console.log(error);
        notification.save();
        User.findOne({ _id: post.userID }, (err, user) => {
          if (user) {
            sendEmail(
              user,
              "Ghostit Notification",
              notification.title,
              returnObject => {
                console.log(returnObject);
              }
            );
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
