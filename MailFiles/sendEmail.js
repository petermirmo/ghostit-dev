const nodemailer = require("nodemailer");
const keys = require("../config/keys");

module.exports = {
  sendEmail: function(user, body, subject, callback) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: keys.email,
        pass: keys.emailPassword
      }
    });

    var mailOptions = {
      from: keys.email,
      to: user.email,
      subject: subject,
      text: body
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        callback({
          success: false,
          errorMessage:
            "Could not send email to this address. Please contact us immediately for assistance."
        });
      } else {
        callback({ success: true });
      }
    });
  }
};
