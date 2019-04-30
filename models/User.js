const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    country: String,
    dateCreated: Date,
    defaultCalendarID: Schema.Types.ObjectId,
    email: String,
    fullName: String,
    image: {
      publicID: String,
      url: String
    },
    password: String,
    plan: { id: String, name: String },
    role: String,
    signedInAsUser: { id: String, fullName: String },
    stripeCustomerID: String,
    stripeSubscriptionID: String,
    tempID: String,
    tempPassword: String,
    timezone: String,
    website: String,
    writer: { id: String, name: String }
  },
  {
    timestamps: true
  }
);

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("users", userSchema);
