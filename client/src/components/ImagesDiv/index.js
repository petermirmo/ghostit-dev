import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faImages from "@fortawesome/fontawesome-free-solid/faImages";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import GIContainer from "../containers/GIContainer";
import "./style.css";

class ImagesDiv extends Component {
  showImages(event) {
    let newImages = event.target.files;
    const { currentImages } = this.props; // Variables
    const { handleChange } = this.props; // Functions
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
          image,
          imagePreviewUrl: reader.result
        });

        handleChange({ images: temp, somethingChanged: true });
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
    parentStateChangeObject.somethingChanged = true;
    handleChange(parentStateChangeObject);
  };

  render() {
    const { canEdit, currentImages, hideUploadButton, id } = this.props;

    return (
      <GIContainer className="images-container">
        {!hideUploadButton &&
          currentImages.length < this.props.imageLimit &&
          canEdit && (
            <div>
              <label
                htmlFor={id}
                className="custom-file-upload pa16 br8 clickable"
              >
                <FontAwesomeIcon
                  icon={faImages}
                  className="image-upload-icon px4"
                />
              </label>

              <input
                id={id}
                type="file"
                onChange={event => this.showImages(event)}
                multiple
              />
            </div>
          )}

        {currentImages.map((image, index) => (
          <div key={index} className="relative ml8 image-container">
            <img
              key={index}
              src={image.imagePreviewUrl ? image.imagePreviewUrl : image.url}
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
        ))}
      </GIContainer>
    );
  }
}

export default ImagesDiv;
