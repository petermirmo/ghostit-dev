const request = require("request");
const fs = require("fs");
const Newsletter = require("../models/Newsletter");
const Calendar = require("../models/Calendar");
const generalFunctions = require("./generalFunctions");

const cloudinary = require("cloudinary");

const deleteNewsletterStandalone = (req, callback) => {
  // function called when calendar gets deleted and blogs within the calendar must be deleted first
  const { newsletterID, skipUserCheck } = req;
  let userID = req.user._id;
  if (req.user.signedInAsUser) {
    if (req.user.signedInAsUser.id) {
      userID = req.user.signedInAsUser.id;
    }
  }

  Newsletter.findOne({ _id: newsletterID }, async (err, foundNewsletter) => {
    if (err || !foundNewsletter) callback({ success: false, err });
    else {
      if (!skipUserCheck) {
        let invalidUser = false;
        await Calendar.findOne(
          { _id: foundNewsletter.calendarID, userIDs: userID },
          (err, foundCalendar) => {
            if (err) {
              invalidUser = true;
              callback({
                success: false,
                err,
                message: `Error while looking up calendar's user list.`
              });
            } else if (!foundCalendar) {
              invalidUser = true;
              callback({
                success: false,
                message: `User doesn't seem to be valid member of calendar. Reload page and try again.`
              });
            }
          }
        );
        if (invalidUser) return;
      }
      if (foundNewsletter.wordDoc.publicID) {
        await cloudinary.uploader.destroy(
          foundNewsletter.wordDoc.publicID,
          error => {
            // handle error
          },
          { resource_type: "raw" }
        );
      }
      foundNewsletter.remove();
      callback({ success: true });
    }
  });
};

module.exports = {
  saveNewsletter: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Newsletter.findOne({ _id: req.body.newsletter._id }, async function(
      err,
      foundNewsletter
    ) {
      if (err) generalFunctions.handleError(res, err);
      else {
        let newNewsletter;
        let { newsletter, newsletterFile, newsletterFileName } = req.body;

        if (foundNewsletter) {
          newNewsletter = foundNewsletter;
          newNewsletter.postingDate = newsletter.postingDate;
          newNewsletter.dueDate = newsletter.dueDate;
          newNewsletter.notes = newsletter.notes;
          newNewsletter.wordDoc = newsletter.wordDoc;
        } else newNewsletter = new Newsletter(newsletter);

        newNewsletter.userID = userID;
        newNewsletter.socialType = "newsletter";
        newNewsletter.color = "#fd651c";

        if (newsletterFile.localPath) {
          // Delete old wordDoc
          if (newNewsletter.wordDoc.publicID) {
            await cloudinary.uploader.destroy(
              newNewsletter.wordDoc.publicID,
              function(result) {
                if (result.error) {
                  return generalFunctions.handleError(res, result.error);
                }
              },
              { resource_type: "raw" }
            );
          }

          // Upload new file
          await cloudinary.v2.uploader.upload(
            newsletterFile.localPath,
            { resource_type: "raw", public_id: newsletterFileName },
            function(error, result) {
              if (error) return generalFunctions.handleError(res, error);
              newNewsletter.wordDoc = {
                url: result.url,
                publicID: result.public_id,
                name: newsletterFileName
              };
            }
          );
        }

        newNewsletter.save().then(result => {
          res.send({ success: true, newsletter: newNewsletter });
        });
      }
    });
  },
  getNewsletters(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Newsletter.find({ userID }, function(err, newsletters) {
      if (err) generalFunctions.handleError(res, err);
      else res.send({ success: true, newsletters });
    });
  },
  deleteNewsletter(req, res) {
    deleteNewsletterStandalone(
      { newsletterID: req.params.newsletterID, user: req.user },
      result => {
        res.send(result);
      }
    );
  },
  deleteNewsletterStandalone
};
