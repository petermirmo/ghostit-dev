const User = require("../models/User");
const Plan = require("../models/Plan");
const Post = require("../models/Post");
const bcrypt = require("bcrypt-nodejs");

const keys = require("../config/keys");
const generalFunctions = require("./generalFunctions");

var stripe = require("stripe")(keys.stripeSecretKey);

module.exports = {
  updateUser: function(req, res) {
    let userID = req.params.userID;
    if (userID != String(req.user._id))
      return generalFunctions.handleError(res, "Not your account");
    else {
      User.findById(userID, function(err, user) {
        if (err) return generalFunctions.handleError(res, err);
        else {
          // Check if email has changed
          let checkAndUpdateUser = () => {
            if (req.body.newPassword) {
              if (bcrypt.compareSync(req.body.password, user.password))
                user.password = user.generateHash(req.body.newPassword);
              else
                return generalFunctions.handleError(res, "Incorrect password");
            }
            // Update user
            user.email = req.body.email;
            user.fullName = req.body.fullName;
            user.timezone = req.body.timezone;
            user.website = req.body.website;
            user.save().then(result => {
              res.send({ success: true, result });
            });
          };

          if (user.email !== req.body.email) {
            // Check if changed email is in use in a different account
            User.findOne({ email: req.body.email }, function(err, foundEmail) {
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
  currentUser: function(req, res) {
    if (req.user) {
      res.send({ success: true, user: req.user });
    } else {
      res.send({ success: false });
    }
  },
  getTimezone: function(req, res) {
    const { user } = req;
    let timezone = user.timezone;
    if (user.signedInAsUser) {
      if (user.signedInAsUser.id) {
        User.findOne({ _id: user.signedInAsUser.id }, function(err, user) {
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
  userInvoices: function(req, res) {
    let currentUser = req.user;

    if (!currentUser.stripeCustomerID)
      return generalFunctions.handleError(res, "Not a stripe customer");
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
