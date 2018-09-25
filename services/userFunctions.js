const User = require("../models/User");
const Plan = require("../models/Plan");
const Post = require("../models/Post");
const bcrypt = require("bcrypt-nodejs");

const keys = require("../config/keys");

var stripe = require("stripe")(keys.stripeSecretKey);

module.exports = {
  updateUser: function(req, res) {
    let userID = req.params.userID;
    if (userID != String(req.user._id)) {
      res.send({ success: false, loggedIn: false });
      return;
    }

    User.findById(userID, function(err, user) {
      if (err) return handleError(err);
      // Check if email has changed
      let checkAndUpdateUser = () => {
        if (req.body.newPassword) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            user.password = user.generateHash(req.body.newPassword);
          } else {
            res.send({
              success: false,
              message: "Incorrect password"
            });
            return;
          }
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
          if (err) return handleError(err);
          // Email already exists
          if (foundEmail) {
            res.send({
              success: false,
              message: "Email already in use!"
            });
            return;
          } else {
            checkAndUpdateUser();
          }
        });
      } else {
        checkAndUpdateUser();
      }
    });
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
          if (user) {
            timezone = user.timezone;
          } else {
            console.log("Cannot find users timezone");
            res.send({ success: false, message: "Cannot find users timezone" });
            return;
          }
          res.send({ success: true, timezone: timezone });
        });
      } else {
        res.send({ success: true, timezone: timezone });
      }
    } else {
      res.send({ success: true, timezone: timezone });
    }
  },
  userInvoices: function(req, res) {
    let currentUser = req.user;

    if (!currentUser.stripeCustomerID) {
      res.send({ success: false, message: "Not a stripe customer" });
      return;
    }
    stripe.invoices.list(
      { customer: currentUser.stripeCustomerID },
      (err, invoices) => {
        if (err) {
          res.send({ success: false, message: err });
        } else if (invoices) {
          res.send({ success: true, invoices: invoices.data });
        } else {
          res.send({ success: false, message: "No invoices found!" });
        }
      }
    );
  }
};
