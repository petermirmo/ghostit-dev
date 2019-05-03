const User = require("../models/User");
const Plan = require("../models/Plan");
const Post = require("../models/Post");
const bcrypt = require("bcrypt-nodejs");

const keys = require("../config/keys");
const generalFunctions = require("./generalFunctions");

var stripe = require("stripe")(keys.stripeSecretKey);

const { deleteFiles, uploadFiles } = require("../util");

module.exports = {
  updateUser: (req, res) => {
    const userID = req.params.userID;

    if (userID != String(req.user._id)) {
      return generalFunctions.handleError(res, "Not your account");
    } else {
      User.findById(userID, (err, user) => {
        const {
          email,
          fullName,
          image,
          timezone,
          website,
          newPassword
        } = req.body;
        if (err) return generalFunctions.handleError(res, err);
        else {
          const saveUpdatedUser = uploadedFiles => {
            // Update user
            if (email) user.email = email;
            if (fullName) user.fullName = fullName;
            if (timezone) user.timezone = timezone;
            if (website) user.website = website;
            if (uploadedFiles) user.image = uploadedFiles[0];

            user.save().then(result => {
              res.send({ success: true, result });
            });
          };
          let checkAndUpdateUser = () => {
            if (newPassword)
              user.password = user.generateHash(req.body.newPassword);

            if (user.image) {
              if (user.image.publicID) {
                deleteFiles([user.image], () => {});
              }
            }

            if (image)
              if (image.file) uploadFiles([image], saveUpdatedUser);
              else saveUpdatedUser();
            else saveUpdatedUser();
          };

          if (user.email !== req.body.email) {
            // Check if changed email is in use in a different account
            User.findOne({ email: req.body.email }, (err, foundEmail) => {
              if (err) generalFunctions.handleError(res, err);
              // Email already exists
              else if (foundEmail)
                return generalFunctions.handleError(
                  res,
                  "Email already in use!"
                );
              else {
                checkAndUpdateUser();
              }
            });
          } else {
            checkAndUpdateUser();
          }
        }
      });
    }
  },
  currentUser: (req, res) => {
    if (req.user) {
      res.send({ success: true, user: req.user });
    } else {
      res.send({ success: false });
    }
  },
  getTimezone: (req, res) => {
    const { user } = req;
    let timezone = user.timezone;
    if (user.signedInAsUser) {
      if (user.signedInAsUser.id) {
        User.findOne({ _id: user.signedInAsUser.id }, (err, user) => {
          if (user) res.send({ success: true, timezone: user.timezone });
          else
            return generalFunctions.handleError(
              res,
              "Cannot find users timezone"
            );
        });
      } else res.send({ success: true, timezone });
    } else res.send({ success: true, timezone });
  },
  userInvoices: (req, res) => {
    let currentUser = req.user;

    if (!currentUser.stripeCustomerID)
      return generalFunctions.handleError(
        res,
        "You have no billing history because you have not paid us yet. Let's fix that!"
      );
    else {
      stripe.invoices.list(
        { customer: currentUser.stripeCustomerID },
        (err, invoices) => {
          if (err) generalFunctions.handleError(res, err);
          else if (invoices)
            res.send({ success: true, invoices: invoices.data });
          else generalFunctions.handleError(res, "No invoices found!");
        }
      );
    }
  }
};
