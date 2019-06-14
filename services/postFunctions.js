const request = require("request");
const cheerio = require("cheerio");
const cloudinary = require("cloudinary");
const moment = require("moment-timezone");

const Post = require("../models/Post");
const User = require("../models/User");
const Email = require("../models/Email");
const Account = require("../models/Account");
const Calendar = require("../models/Calendar");

const {
  isUrlImage,
  isUrlVideo,
  uploadFiles,
  whatFileTypeIsUrl
} = require("../util");

const canCopyAttributeDirectly = index => {
  if (index === "linkCustomFiles") {
    return false;
  } else {
    return true;
  }
};
const isBinaryImage = string => {
  if (string.length > 500) return true;
  else return false;
};

const deletePostStandalone = (req, callback) => {
  // function called indirectly when deleting a post normally
  // called directly (with skipUserCheck = true) when deleting an entire calendar
  // we skip the user checks in that case bcz the user would have already been cleared to delete the calendar
  const { postID, skipUserCheck } = req;
  Post.findOne({ _id: postID }, async (err, post) => {
    if (post && !err) {
      if (!skipUserCheck) {
        // need to make sure the user has the right to delete this post
        let userID = req.user._id;
        if (req.user.signedInAsUser) {
          if (req.user.signedInAsUser.id) {
            userID = req.user.signedInAsUser.id;
          }
        }
        let invalidUser = false;
        await Calendar.findOne(
          { _id: post.calendarID, userIDs: userID },
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
                message: `User is not a valid member of the calendar so cannot delete this post.`
              });
            }
          }
        );
        if (invalidUser) return;
      }
      if (post.files) {
        for (let i = 0; i < post.files.length; i++) {
          await cloudinary.uploader.destroy(
            post.files[i].publicID,
            result => {
              // TO DO: handle error here
            },
            { resource_type: whatFileTypeIsUrl(post.files[i].url) }
          );
        }
      }
      post.remove().then(result => {
        callback({ success: true });
      });
    } else callback({ success: false, err });
  });
};

module.exports = {
  deleteFile: function(req, res) {
    cloudinary.uploader.destroy(req.params.publicID, function(result) {
      res.send(true);
      // TO DO: handle error here
    });
  },
  getImagesFromUrl: function(req, res) {
    let url = req.body.link;

    request(url, (err, result, body) => {
      let domain;

      if (result)
        if (result.connection)
          if (result.connection._host) domain = result.connection._host;

      if (err) {
        console.log(err);
        res.send(false);
        return;
      }
      let imgSrc = [];
      if (!body) {
        console.log("No images found");
        res.send(false);
        return;
      }
      let $ = cheerio.load(body);
      $("img").each((index, img) => {
        imgSrc.push(img.attribs.src);
      });

      let linkTitle;
      let linkDescription;

      let foundMetaImage = false;

      $("meta").each((index, meta) => {
        if (meta.attribs.property == "url") {
        } else if (meta.attribs.property == "og:url") {
        } else if (meta.attribs.property == "og:image" && !foundMetaImage) {
          foundMetaImage = true;
          imgSrc.unshift(meta.attribs.content);
        } else if (
          meta.attribs.property == "og:image:secure_url" &&
          !foundMetaImage
        ) {
          foundMetaImage = true;
          imgSrc.unshift(meta.attribs.content);
        } else if (meta.attribs.property == "image" && !foundMetaImage) {
          foundMetaImage = true;
          imgSrc.unshift(meta.attribs.content);
        } else if (
          meta.attribs.property == "image:secure_url" &&
          !foundMetaImage
        ) {
          foundMetaImage = true;
          imgSrc.unshift(meta.attribs.content);
        } else if (meta.attribs.property == "title" && !linkTitle) {
          linkTitle = meta.attribs.content;
        } else if (meta.attribs.property == "description" && !linkDescription) {
          linkDescription = meta.attribs.content;
        } else if (meta.attribs.property == "og:title" && !linkTitle) {
          linkTitle = meta.attribs.content;
        } else if (
          meta.attribs.property == "og:description" &&
          !linkDescription
        ) {
          linkDescription = meta.attribs.content;
        }
      });
      for (let index in imgSrc) {
        if (imgSrc[index]) {
          if (!imgSrc[index].startsWith("http")) {
            if (imgSrc[index].startsWith("/"))
              imgSrc[index] = "https://" + domain + imgSrc[index];
            else imgSrc[index] = "https://" + domain + "/" + imgSrc[index];
          }
        }
      }
      res.send({ imgSrc, linkTitle, linkDescription });
    });
  },
  savePost: (req, res) => {
    const post = req.body;

    Calendar.findOne({ _id: post.calendarID }, (err, foundCalendar) => {
      if (err || !foundCalendar) {
        res.send({
          success: false,
          err,
          message: "Error while looking up calendar in the database."
        });
      } else {
        Post.findOne({ _id: post._id }, (err, foundPost) => {
          let newPost = new Post();

          if (err) {
            console.log(err);
            res.send(false);
            return;
          } else if (foundPost) {
            newPost = foundPost;
          }

          let userID = req.user._id;
          if (req.user.signedInAsUser) {
            if (req.user.signedInAsUser.id) {
              userID = req.user.signedInAsUser.id;
            }
          }
          // Set color of post
          let backgroundColorOfPost;
          if (post.socialType === "facebook") backgroundColorOfPost = "#4267b2";
          else if (post.socialType === "twitter")
            backgroundColorOfPost = "#1da1f2";
          else if (post.socialType === "linkedin")
            backgroundColorOfPost = "#0077b5";
          else if (post.socialType === "instagram")
            backgroundColorOfPost = "#cd486b";
          else if (post.socialType === "custom")
            backgroundColorOfPost = "var(--seven-purple-color)";

          let emailReminder;
          if (post.sendEmailReminder && !newPost.emailReminder) {
            emailReminder = new Email({ userID, postID: post._id });
            emailReminder.save();
          }

          newPost.userID = userID;
          newPost.color = backgroundColorOfPost;
          newPost.emailReminder = emailReminder;
          if (post.socialType !== "custom") {
            newPost.status = "pending";
          }

          for (let index in post) {
            if (canCopyAttributeDirectly(index)) newPost[index] = post[index];
          }
          finalSavePost = readyToSavePost => {
            readyToSavePost
              .save()
              .then(result => res.send({ success: true, post: result }));
          };

          if (post.linkImage) {
            if (isBinaryImage(post.linkImage)) {
              let uploadedLinkCustomFiles = [];

              uploadFiles([post.linkImage], uploadedFiles => {
                newPost.linkCustomFiles.unshift(uploadedFiles[0]);
                if (uploadedFiles[0]) newPost.linkImage = uploadedFiles[0].url;

                finalSavePost(newPost);
              });
            } else {
              finalSavePost(newPost);
            }
          } else {
            finalSavePost(newPost);
          }
        });
      }
    });
  },
  getPost: (req, res) => {
    Post.findOne({ _id: req.params.postID }, (err, post) => {
      if (err) res.send({ success: false, err });
      else res.send({ success: true, post });
    });
  },
  uploadPostFiles: (req, res) => {
    const postID = req.body.postID;
    const { files } = req.body;

    Post.findOne({ _id: postID }, (err, post) => {
      if (err) {
        console.log(err);
        res.send(false);
        return;
      }

      uploadFiles(files, uploadedFiles => {
        for (let index in uploadedFiles) {
          post.files.push(uploadedFiles[index]);
        }
        post
          .save()
          .then(result => res.send({ success: true, savedPost: result }));
      });
    });
  },
  deletePostFiles: async (req, res) => {
    let deleteFilesArray = req.body;
    // Delete files from cloudinary
    for (let i = 0; i < deleteFilesArray.length; i++) {
      await cloudinary.uploader.destroy(
        deleteFilesArray[i].publicID,
        result => {
          // TO DO: handle error here
        },
        { resource_type: whatFileTypeIsUrl(deleteFilesArray[i].url) }
      );
    }
    Post.findOne({ _id: req.params.postID }, (err, post) => {
      for (let i = 0; i < post.files.length; i++) {
        for (let j = 0; j < deleteFilesArray.length; j++) {
          if (post.files[i].publicID === deleteFilesArray[j].publicID) {
            post.files.splice(i, 1);
          }
        }
      }
      post.save().then(result => res.send(true));
    });
  },
  deletePost: (req, res) => {
    deletePostStandalone(
      { postID: req.params.postID, user: req.user },
      result => res.send(result)
    );
  },
  deletePostStandalone
};
