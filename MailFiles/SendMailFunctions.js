const User = require("../models/User");
const { sendEmail } = require("./sendEmail");

module.exports = {
  bookCall: (req, res) => {
    const {
      afternoons,
      blogging,
      email,
      emailNewsletters,
      name,
      message,
      mornings,
      paidAdvertisements,
      phoneNumber,
      socialMedia,
      url,
      webDev,
      weekdays,
      weekends
    } = req.body;

    return sendEmail(
      { email: "rahul@ghostit.co" },
      url ? "Free Ghostit Audit" : "Ghostit Lead",
      url
        ? "Email Address: " + email + "\n" + "website: " + url + "\n"
        : "Name: " +
            name +
            "\n" +
            "Message: " +
            message +
            "\n" +
            "Email Address: " +
            email +
            "\n" +
            "Phone Number: " +
            phoneNumber +
            "\n\n" +
            "Times Available\n" +
            "mornings: " +
            mornings +
            "\n" +
            "afternoons: " +
            afternoons +
            "\n" +
            "weekdays: " +
            weekdays +
            "\n" +
            "weekends: " +
            weekends +
            "\n\n" +
            "Services Required\n" +
            "Blogs: " +
            blogging +
            "\n" +
            "Social Media: " +
            socialMedia +
            "\n" +
            "Email Newsletters: " +
            emailNewsletters +
            "\n" +
            "Web Development and Design: " +
            webDev +
            "\n" +
            "Paid Advertisements and Promotions: " +
            paidAdvertisements,

      results => {
        res.send(results);
      }
    );
  },
  sendPasswordReset: async (req, res) => {
    let { email } = req.body;

    let temporaryPassword = Math.random()
      .toString(36)
      .substring(7);

    User.findOne({ email }, (err, user) => {
      if (err) {
        console.log(err);
        res.send({ success: false, errorMessage: err });
      } else if (user) {
        user.tempPassword = user.generateHash(temporaryPassword);
        user.save();
        sendEmail(
          user,
          "Ghostit Password Reset",
          "Your temporary password is " +
            temporaryPassword +
            ". You will still be able to use your old password until you have logged in with this new password.",
          results => {
            res.send(results);
          }
        );
      } else {
        console.log(err);
        res.send({
          success: false,
          errorMessage: "User not found with this email address!"
        });
      }
    });
  }
};
