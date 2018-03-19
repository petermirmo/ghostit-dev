import React, { Component } from "react";
import "../../css/theme.css";

class ImagesDiv extends Component {
	constructor(props) {
		super(props);

		this.removePhoto = this.removePhoto.bind(this);
	}

	showImages(event) {
		var images = event.target.files;

		// Check to make sure there are not more than the imageLimit
		var currentImages = this.props.postImages;
		if (currentImages === undefined) {
			currentImages = [];
		}
		if (images.length + currentImages.length > this.props.imageLimit) {
			alert("You have selected more than " + this.props.imageLimit + " images! Please try again");
			return;
		}

		// Check to make sure each image is under 5MB
		for (var index = 0; index < images.length; index++) {
			if (images[index].size > 5000000) {
				alert("File size on one or more photos is over 5MB( Please try again");
				return;
			}
		}

		// Save each image to state
		var imagesArray = this.props.postImages;
		if (imagesArray === undefined) {
			imagesArray = [];
		}
		for (index = 0; index < images.length; index++) {
			let reader = new FileReader();
			let image = images[index];
			reader.onloadend = () => {
				var imageObject = {
					image: image,
					imagePreviewUrl: reader.result
				};
				imagesArray.push(imageObject);
				if (index === images.length) {
					this.props.setPostImages(imagesArray);
				}
			};

			reader.readAsDataURL(image);
		}
	}
	removePhoto(event) {
		var currentImages = this.props.postImages;
		// <i> tag can be clicked as well as image tag, so this code checks siblings to make sure we got the <img> tag
		var clickedImage = event.target.previousElementSibling;
		if (clickedImage === null) {
			clickedImage = event.target;
		}

		// ID of img tag is "image" + index in the array ex. image1
		// We will remove "image" leaving us with just the index
		var indexOfRemovalImage = clickedImage.id.replace("image", "");

		// Only add if it is in cloudinary already.If url is null it is not in the database yet
		if (currentImages[indexOfRemovalImage].url !== undefined) {
			this.props.pushToImageDeleteArray(currentImages[indexOfRemovalImage]);
		}
		// Remove image from current images
		currentImages.splice(indexOfRemovalImage, 1);

		// Update state
		this.props.setPostImages(currentImages);
	}

	render() {
		// Initialize current images
		var currentImages = this.props.postImages;
		if (currentImages === undefined) {
			currentImages = [];
		}

		// Image upload button
		var fileUploadDiv;
		var divID = this.props.divID;
		if (divID === undefined) {
			divID = "file-upload";
		}
		if (currentImages.length < this.props.imageLimit) {
			fileUploadDiv = (
				<div>
					<label htmlFor={divID} className="custom-file-upload">
						Upload Images! (Up to {this.props.imageLimit})
					</label>

					<input id={divID} type="file" onChange={event => this.showImages(event)} multiple />
				</div>
			);
		}

		// Show preview images
		var imagesDiv = [];
		var imageClass;
		if (this.props.canDeleteImage === true || this.props.canDeleteImage === undefined) {
			imageClass = "image-container delete-image-container";
		} else {
			imageClass = "image-container ";
		}
		for (var index in currentImages) {
			// If image has been removed index will equal null
			var imageURL = currentImages[index].imagePreviewUrl;
			if (currentImages[index].imagePreviewUrl === undefined) {
				imageURL = currentImages[index].url;
			}

			var imageTag = (
				<div key={index} className={imageClass} onClick={event => this.removePhoto(event)}>
					<img id={"image" + index.toString()} key={index} src={imageURL} alt="error" />
					<i className="fa fa-times fa-3x" />
				</div>
			);
			imagesDiv.push(imageTag);
		}
		return (
			<div>
				{fileUploadDiv}
				{imagesDiv}
			</div>
		);
	}
}

export default ImagesDiv;
