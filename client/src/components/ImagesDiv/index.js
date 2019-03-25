import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faImages from "@fortawesome/fontawesome-free-solid/faImages";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";
import "./style.css";

class ImagesDiv extends Component {
  showImages(event) {
    let newImages = event.target.files;
    const { currentImages } = this.props;
    let temp = currentImages;

    // Check to make sure there are not more than the imageLimit
    if (newImages.length + currentImages.length > this.props.imageLimit) {
      alert(
        "You have selected more than " +
          this.props.imageLimit +
          " images! Please try again"
      );
      return;
    }

    // Check to make sure each image is under 5MB
    for (let index = 0; index < newImages.length; index++) {
      if (newImages[index].size > 5000000) {
        alert("File size on one or more photos is over 5MB( Please try again");
        return;
      }
    }
    // Save each image to state
    for (let index = 0; index < newImages.length; index++) {
      let reader = new FileReader();
      let image = newImages[index];
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
    const { currentImages, imagesToDelete } = this.props; // Variables
    const { handleChange } = this.props; // Functions

    const parentStateChangeObject = {};

    // Only add if it is in cloudinary already.If url is null it is not in the database yet
    if (currentImages[index].url !== undefined) {
      imagesToDelete.push(currentImages[index]);
      parentStateChangeObject.imagesToDelete = imagesToDelete;
    }
    // Remove image from current images
    currentImages.splice(index, 1);

    // Update parent state
    parentStateChangeObject.currentImages = currentImages;
    handleChange(parentStateChangeObject);
  };

  render() {
    const { canEdit, currentImages, hideUploadButton } = this.props;

    // Image upload button
    let fileUploadDiv;

    if (currentImages.length < this.props.imageLimit && canEdit) {
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
    for (let index in currentImages) {
      let imageURL = currentImages[index].imagePreviewUrl;
      if (!currentImages[index].imagePreviewUrl) {
        imageURL = currentImages[index].url;
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
