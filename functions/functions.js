const { sendEmail } = require("../MailFiles/sendEmail");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Calendar = require("../models/Calendar");

module.exports = {
  savePostError: (postID, error) => {
    console.log(error);

    Post.findOne({ _id: postID }, (err, post) => {
      if (post) {
        let notification = new Notification({ seen: false });
        notification.userID = post.userID;
        notification.title =
          "Oh no! Your " +
          post.socialType +
          " session with Ghostit has ended. Please reconnect this account as soon as possible so there are no more interuptions in your social media posting.";
        User.findOne({ _id: post.userID }, (err, user) => {
          if (user) {
            notification.message =
              "User's ID: " +
              user._id +
              " user's name: " +
              user.fullName +
              " Post error: " +
              post.errorMessage +
              "Post content: " +
              post.content +
              " Post socialType: " +
              post.socialType;

            let notificationToPeter = new Notification({ seen: false });
            notificationToPeter.message = notification.message;
            notificationToPeter.title = notification.title;
            notificationToPeter.userID = "5acfa9409f3e9e06ac173d26";
            notification.save();
            notificationToPeter.save();

            /*sendEmail(
              user,
              "Ghostit Notification",
              notification.title,
              returnObject => {
                return returnObject;
              }
            );*/
          }
        });
      }
      post.status = "error";
      post.errorMessage = JSON.stringify(error);
      post.save();
    });
  },
  savePostSuccessfully: (postID, socialMediaPostID) => {
    Post.findOne({ _id: postID }, (err, result) => {
      Calendar.findOne({ _id: result.calendarID }, (err, foundCalendar) => {
        if (err || !foundCalendar) {
        } else {
          if (foundCalendar.postsLeft > 0) {
            // decrementing this variable makes it so that a demo user can't just delete their past posts to get around their calendar post limit
            foundCalendar.postsLeft = foundCalendar.postsLeft - 1;
            foundCalendar.save();
          }
        }
      });
      result.status = "posted";
      result.socialMediaID = socialMediaPostID;
      result.save().then(response => {
        return;
      });
    });
  }
};
