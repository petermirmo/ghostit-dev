const cloudinary = require("cloudinary");

const isUrlImage = url => {
  return url.match(/image/);
};
const isUrlVideo = url => {
  return url.match(/video/);
};
const whatFileTypeIsUrl = url => {
  if (isUrlImage(url)) return "image";
  else if (isUrlVideo(url)) return "video";
  else return "raw";
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

module.exports = {
  deleteFiles,
  isUrlImage,
  isUrlVideo,
  uploadFiles,
  whatFileTypeIsUrl
};
