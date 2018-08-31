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
          if (post) {
            User.findOne({ _id: post.userID }, (err, user) => {
              if (post && user) {
                if (post.emailReminder) {
                  let currentDate = new Date();
                  let postingDateMinusThirty = new Date(post.postingDate);
                  postingDateMinusThirty.setMinutes(
                    postingDateMinusThirty.getMinutes() - 30
                  );
                  if (postingDateMinusThirty < currentDate) {
                    let taskTitle = post.name
                      ? post.name.trim()
                      : "Custom Task";
                    sendEmail(
                      user,
                      "Your task " + taskTitle + " is due!",
                      "Ghostit Scheduled Task",
                      () => {
                        emailReminder.remove();
                      }
                    );
                  }
                } else emailReminder.remove();
              } else if (!post || !user) emailReminder.remove();
            });
          } else emailReminder.remove();
        });
      }
    });
  }
};
