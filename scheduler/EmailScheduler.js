const { sendEmail } = require("../MailFiles/sendEmail");
const Email = require("../models/Email");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  main: function() {
    Email.find({}, (err, emailReminders) => {
      for (let index in emailReminders) {
        let emailReminder = emailReminders[index];
        Post.findOne({ _id: emailReminder.postID }, (err, post) => {
          User.findOne({ _id: post.userID }, (err, user) => {
            if (post && user) {
              let currentDate = new Date();
              let postingDateMinusThirty = new Date(post.postingDate);
              postingDateMinusThirty.setMinutes(
                postingDateMinusThirty.getMinutes() - 30
              );
              if (postingDateMinusThirty < currentDate) {
                sendEmail(
                  user,
                  "Your task " + post.name
                    ? post.name.trim()
                    : "Custom Task" + " is due in 30 minutes!",
                  "Ghostit Scheduled Task",
                  () => {
                    console.log(emailReminder);
                    emailReminder.remove();
                  }
                );
              }
            } else if (!post || !user) emailReminder.remove();
          });
        });
      }
    });
  }
};
