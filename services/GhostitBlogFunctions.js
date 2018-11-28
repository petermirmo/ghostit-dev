const User = require("../models/User");
const GhostitBlog = require("../models/GhostitBlog");

const moment = require("moment-timezone");
const { handleError } = require("./generalFunctions");

module.exports = {
  saveGhostitBlog: (req, res) => {
    let userID = req.user._id;
    let test = req.body;
  }
};
