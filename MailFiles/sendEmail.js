const nodemailer = require("nodemailer");
const keys = require("../config/keys");

module.exports = {
	sendEmail: function(user, body, subject, callback) {
		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				type: "OAuth2",
				user: keys.email,
				clientId: keys.googleClientId,
				clientSecret: keys.googleClientSecret,
				refreshToken: keys.googleRefreshToken
			}
		});

		let mailOptions = {
			from: "Ghostit <" + keys.email + ">",
			to: user.email,
			subject: subject,
			text: body
		};

		transporter.sendMail(mailOptions, function(err, result) {
			if (err) {
				console.log(err);
				callback({
					success: false,
					errorMessage: "Could not send email to this address. Please contact us immediately for assistance."
				});
			} else {
				callback({ success: true });
			}
		});
	}
};
