export const removeFile = (
  currentFiles,
  filesToDelete,
  handleParentChange,
  index
) => {
  const parentStateChangeObject = {};

  // Only add if it is in cloudinary already.If url is null it is not in the database yet
  if (currentFiles[index].url !== undefined) {
    filesToDelete.push(currentFiles[index]);
    parentStateChangeObject.filesToDelete = filesToDelete;
  }
  // Remove image from current images
  currentFiles.splice(index, 1);

  // Update parent state
  parentStateChangeObject.currentFiles = currentFiles;
  parentStateChangeObject.somethingChanged = true;
  handleParentChange(parentStateChangeObject);
};

export const showFiles = (
  event,
  currentFiles,
  fileLimit,
  handleParentChange
) => {
  let newFiles = event.target.files;

  // Check to make sure there are not more than the fileLimit
  if (newFiles.length + currentFiles.length > fileLimit) {
    alert(
      "You have selected more than " + fileLimit + " files! Please try again"
    );
    return;
  }

  // Check to make sure each file is under 5MB
  for (let index = 0; index < newFiles.length; index++) {
    let fileToCheck = newFiles[index];
    if (isFileOverSize(fileToCheck)) {
      return alert(
        "Please contact peterm@ghostit.co for technical support. We do not currently support this file format, but we may do a software update if you contact us."
      );
    }
  }

  setFilesToParentState(newFiles, currentFiles, handleParentChange);
};

const setFilesToParentState = (newFiles, currentFiles, handleParentChange) => {
  // Save each file to state
  for (let index = 0; index < newFiles.length; index++) {
    let reader = new FileReader();
    let file = newFiles[index];
    reader.onloadend = file => {
      currentFiles.push({
        file,
        previewUrl: reader.result,
        type: getFileType(file)
      });

      handleParentChange({ files: currentFiles, somethingChanged: true });
    };
    reader.readAsDataURL(file);
  }
};

const isFileOverSize = fileToCheck => {
  if (isImage(fileToCheck)) {
    if (fileToCheck.size > 5000000) {
      alert("File size on one or more photos is over 5MB.");
      return true;
    }
  } else if (isVideo(fileToCheck)) {
    if (fileToCheck.size > 10000000) {
      alert("File size on one or more videos is over 10MB.");
      return true;
    }
  } /*else if (isGif(fileToCheck)) {
    if (fileToCheck.size > 5000000) {
      alert("File size on one or more gifs is over 5MB.");
      return true;
    }
  }*/ else
    return false;
};

export const isImage = fileToCheck => {
  const fileExtension = getFileExtension(fileToCheck);
  return fileExtension.match(
    /(\.|\/)(jpe?g|ico|png|svg|woff|ttf|wav|mp3)($|;)/
  );
};

export const isVideo = fileToCheck => {
  const fileExtension = getFileExtension(fileToCheck);
  return fileExtension.match(/(\.|\/)(avi|flv|wmv|mov|mp4)($|;)/);
};

export const isGif = fileToCheck => {
  const fileExtension = getFileExtension(fileToCheck);
  return fileExtension.match(/(\.|\/)(gif)($|;)/);
};
const getFileType = file => {
  if (isImage(file)) return "image";
  else if (isVideo(file)) return "video";
  else if (isGif(file)) return "gif";
  else {
    return alert(
      "Error cannot read file extension, please contact peterm@ghostit.co"
    );
  }
};
const getFileExtension = file => {
  if (file.name) return file.name;
  else if (file.previewUrl) return file.previewUrl;
  else if (file.url) return file.url;
  else if (file.currentTarget) return file.currentTarget.result;
  else {
    return alert(
      "Error cannot read file extension, please contact peterm@ghostit.co"
    );
  }
};
