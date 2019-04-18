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

module.exports = {
  whatFileTypeIsUrl,
  isUrlImage,
  isUrlVideo
};
