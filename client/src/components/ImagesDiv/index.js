import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faImages from "@fortawesome/fontawesome-free-solid/faImages";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import "./style.css";

class ImagesDiv extends Component {
  showImages(event) {
    let images = event.target.files;
    const { postImages } = this.props;
    let temp = postImages;

    // Check to make sure there are not more than the imageLimit
    if (images.length + postImages.length > this.props.imageLimit) {
      alert(
        "You have selected more than " +
          this.props.imageLimit +
          " images! Please try again"
      );
      return;
    }

    // Check to make sure each image is under 5MB
    for (let index = 0; index < images.length; index++) {
      if (images[index].size > 5000000) {
        alert("File size on one or more photos is over 5MB( Please try again");
        return;
      }
    }
    // Save each image to state
    for (let index = 0; index < images.length; index++) {
      let reader = new FileReader();
      let image = images[index];
      reader.onloadend = image => {
        temp.push({
          image: image,
          imagePreviewUrl: reader.result
        });

        this.props.handleChange(temp);
      };

      reader.readAsDataURL(image);
    }
  }
  removePhoto = index => {
    const { postImages } = this.props;

    // Only add if it is in cloudinary already.If url is null it is not in the database yet
    if (postImages[index].url !== undefined) {
      this.props.pushToImageDeleteArray(postImages[index]);
    }
    // Remove image from current images
    postImages.splice(index, 1);

    // Update state
    this.props.handleChange(postImages);
  };

  render() {
    const { canEdit, postImages, hideUploadButton } = this.props;

    // Image upload button
    let fileUploadDiv;

    if (postImages.length < this.props.imageLimit && canEdit) {
      fileUploadDiv = (
        <div>
          <label htmlFor="file-upload" className="custom-file-upload">
            <FontAwesomeIcon icon={faImages} className="image-upload-icon" />
          </label>

          <input
            id="file-upload"
            type="file"
            onChange={event => this.showImages(event)}
            multiple
          />
        </div>
      );
    }

    // Show preview images
    let imagesDiv = [];
    for (let index in postImages) {
      let imageURL = postImages[index].imagePreviewUrl;
      if (!postImages[index].imagePreviewUrl) {
        imageURL = postImages[index].url;
      }
      imagesDiv.push(
        <div key={index} className="relative ml8 image-container">
          <img
            key={index}
            src={imageURL}
            alt="error"
            className="flex image tiny"
          />
          {canEdit && (
            <FontAwesomeIcon
              icon={faTimes}
              className="icon-x-hover"
              onClick={event => this.removePhoto(index)}
              size="3x"
            />
          )}
        </div>
      );
    }
    return (
      <div className="images-container">
        {!hideUploadButton && fileUploadDiv}
        {imagesDiv}
      </div>
    );
  }
}

export default ImagesDiv;
