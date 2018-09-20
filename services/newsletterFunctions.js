var request = require("request");
var fs = require("fs");
const Newsletter = require("../models/Newsletter");

var cloudinary = require("cloudinary");

module.exports = {
  saveNewsletter: function(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }

    Newsletter.findOne({ _id: req.params.newsletterID }, async function(
      err,
      foundNewsletter
    ) {
      if (err) {
        handleError(res, err);
        return;
      }

      let newNewsletter;
      let { newsletter, newsletterFile, newsletterFileName } = req.body;

      if (foundNewsletter) {
        newNewsletter = foundNewsletter;
        newNewsletter.postingDate = newsletter.postingDate;
        newNewsletter.dueDate = newsletter.dueDate;
        newNewsletter.notes = newsletter.notes;
        newNewsletter.wordDoc = newsletter.wordDoc;
      } else {
        newNewsletter = new Newsletter(newsletter);
      }
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
                handleError(res, result);
                return;
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
            if (error) {
              handleError(res, error);
              return;
            }
            newNewsletter.wordDoc = {
              url: result.url,
              publicID: result.public_id,
              name: newsletterFileName
            };
          }
        );
      }

      newNewsletter.save().then(result => {
        res.send({ success: true });
      });
    });
  },
  getNewsletters(req, res) {
    let userID = req.user._id;
    if (req.user.signedInAsUser) {
      if (req.user.signedInAsUser.id) {
        userID = req.user.signedInAsUser.id;
      }
    }
    Newsletter.find({ userID: userID }, function(err, newsletters) {
      if (err) {
        res.send({ success: false });
      }
      res.send({ success: true, newsletters: newsletters });
    });
  },
  deleteNewsletter(req, res) {
    Newsletter.findOne({ _id: req.params.newsletterID }, async function(
      err,
      newsletter
    ) {
      if (err) {
        handleError(res, err);
      } else if (newsletter) {
        if (
          newsletter.userID === req.user._id ||
          req.user.role === "admin" ||
          req.user.role === "manager"
        ) {
          if (newsletter.wordDoc.publicID) {
            await cloudinary.uploader.destroy(
              newsletter.wordDoc.publicID,
              function(error) {
                if (error) {
                  console.log(error);
                }
              },
              { resource_type: "raw" }
            );
          }
          newsletter.remove().then(result => {
            res.send({ success: true });
          });
        } else {
          handleError(res, "Hacker trying to delete posts");
        }
      } else {
        handleError(res, "Newsletter not found");
      }
    });
  }
};
function handleError(res, errorMessage) {
  console.log(errorMessage);
  res.send({ success: false, message: errorMessage });
  return;
}
