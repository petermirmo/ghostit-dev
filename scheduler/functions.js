const { sendEmail } = require("../MailFiles/sendEmail");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Calendar = require("../models/Calendar");

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
                return returnObject;
              }
            );
          }
          notification.save();
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
