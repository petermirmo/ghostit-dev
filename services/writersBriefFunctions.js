const User = require("../models/User");
const Blog = require("../models/Blog");
const Newsletter = require("../models/Newsletter");
const WritersBrief = require("../models/WritersBrief");
const generalFunctions = require("./generalFunctions");

module.exports = {
  saveWritersBrief: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    let { writersBrief } = req.body;
    writersBrief.userID = userID;
    if (writersBrief._id) {
      WritersBrief.findOne(
        { _id: writersBrief._id },
        (err, foundWritersBrief) => {
          if (err) return generalFunctions.handleError(res, err);
          else if (foundWritersBrief) {
            foundWritersBrief.cycleStartDate = writersBrief.cycleStartDate;
            foundWritersBrief.cycleEndDate = writersBrief.cycleEndDate;
            foundWritersBrief.socialPostsDescriptions =
              writersBrief.socialPostsDescriptions;
            foundWritersBrief.userID = userID;

            foundWritersBrief.save().then(result => {
              if (result === foundWritersBrief) {
                res.send({ success: true });
              } else
                return generalFunctions.handleError(
                  res,
                  "Could not save your writers brief!"
                );
            });
          } else {
            return generalFunctions.handleError(res, "No writers brief found.");
          }
        }
      );
    } else {
      let newWritersBrief = new WritersBrief(writersBrief);
      newWritersBrief.save().then(result => {
        if (result === newWritersBrief) res.send({ success: true });
        else
          return generalFunctions.handleError(
            res,
            "Could not save your writers brief!"
          );
      });
    }
  },
  getWritersBriefs: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    WritersBrief.find({ userID }, (err, writersBriefs) => {
      if (err)
        generalFunctions.handleError(res, "Could not save your writers brief!");
      else res.send({ success: true, writersBriefs });
    });
  },
  getBlogsInBriefs: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    let { cycleStartDate, cycleEndDate } = req.body;
    Blog.find(
      {
        postingDate: { $lt: cycleEndDate },
        postingDate: { $gt: cycleStartDate },
        userID
      },
      (err, blogs) => {
        if (err) return generalFunctions.handleError(res, err);
        else res.send({ success: true, blogs });
      }
    );
  },
  getNewslettersInBriefs: (req, res) => {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    let { cycleStartDate, cycleEndDate } = req.body;
    Newsletter.find(
      {
        postingDate: { $lt: cycleEndDate },
        postingDate: { $gt: cycleStartDate },
        userID: userID
      },
      (err, newsletters) => {
        if (err) return generalFunctions.handleError(res, err);
        else res.send({ success: true, newsletters });
      }
    );
  }
};
