const cloudinary = require("cloudinary");

const {
  errorConnectingToDatabase,
  noSocialAccountFound
} = require("./responseStrings");

const canCopyAttributeDirectly = index => {
  if (index === "linkCustomFiles") {
    return false;
  } else {
    return true;
  }
};

const deleteFiles = (deleteFilesArray, callback) => {
  let asyncCounter = 0;
  for (let i = 0; i < deleteFilesArray.length; i++) {
    asyncCounter++;
    cloudinary.uploader.destroy(
      deleteFilesArray[i].publicID,
      result => {
        asyncCounter--;
        if (asyncCounter === 0) callback();
      },
      { resource_type: whatFileTypeIsUrl(deleteFilesArray[i].url) }
    );
  }
};

const getUserID = req => {
  if (req.user.signedInAsUser)
    if (req.user.signedInAsUser.id) return req.user.signedInAsUser.id;

  return req.user._id;
};

const handleDbReqError = () => {
  return { success: false, message: errorConnectingToDatabase };
};

const isBinaryImage = string => {
  if (string.length > 500) return true;
  else return false;
};
const isProblemWithDbReq = err => {
  if (err || err.error) return true;
  else return false;
};

const isUrlImage = url => {
  return url.match(/image/);
};
const isUrlVideo = url => {
  return url.match(/video/);
};
const isUserAllowedToMakeChanges = (ID1, ID2, user) => {
  if (user.role === "admin") return true;
  else if (ID1 === ID2) return true;
  else return false;
};

const noObjectFoundError = objectName => {
  return {
    success: false,
    message: noSocialAccountFound(objectName)
  };
};
const successfulRequest = () => {
  return { success: true };
};

const userLacksPermissions = () => {
  return {
    success: false,
    message: userNotPermitted
  };
};

const uploadFiles = (files, callback) => {
  const uploadedFiles = [];
  let asyncCounter = 0;

  for (let index in files) {
    asyncCounter++;

    let type = "image";
    let file = files[index];
    if (files[index].file) file = files[index].file;
    if (files[index].type) type = files[index].type;

    cloudinary.v2.uploader.upload(
      file,
      { resource_type: type },
      (error, result) => {
        asyncCounter--;
        if (!error) {
          uploadedFiles.push({
            url: result.secure_url,
            publicID: result.public_id
          });

          if (asyncCounter === 0) {
            callback(uploadedFiles);
          }
        } else {
          console.log(error);
          if (asyncCounter === 0) {
            callback(uploadedFiles);
          }
        }
      }
    );
  }
};

const whatFileTypeIsUrl = url => {
  if (isUrlImage(url)) return "image";
  else if (isUrlVideo(url)) return "video";
  else return "raw";
};

module.exports = {
  canCopyAttributeDirectly,
  deleteFiles,
  getUserID,
  handleDbReqError,
  isProblemWithDbReq,
  isBinaryImage,
  isUrlImage,
  isUrlVideo,
  isUserAllowedToMakeChanges,
  noObjectFoundError,
  successfulRequest,
  uploadFiles,
  userLacksPermissions,
  whatFileTypeIsUrl
};
