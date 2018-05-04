import React, { Component } from "react";

import "./style.css";

class ImagesDiv extends Component {
	showImages(event) {
		let images = event.target.files;
		const { postImages } = this.props;
		let temp = postImages;

		// Check to make sure there are not more than the imageLimit
		if (images.length + postImages.length > this.props.imageLimit) {
			alert("You have selected more than " + this.props.imageLimit + " images! Please try again");
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
			reader.onloadend = () => {
				let imageObject = {
					image: image,
					imagePreviewUrl: reader.result
				};
				temp.push(imageObject);

				if (index + 1 === images.length) {
					this.props.setPostImages(temp);
				}
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
		this.props.setPostImages(postImages);
	};

	render() {
		const { canDeleteImage, postImages } = this.props;

		// Image upload button
		let fileUploadDiv;

		if (postImages.length < this.props.imageLimit) {
			fileUploadDiv = (
				<div>
					<label htmlFor="file-upload" className="custom-file-upload">
						Upload Images! (Up to {this.props.imageLimit})
					</label>

					<input id="file-upload" type="file" onChange={event => this.showImages(event)} multiple />
				</div>
			);
		}

		// Show preview images
		let imagesDiv = [];
		let imageClass;
		if (canDeleteImage === true) {
			imageClass = "image-container delete-image-container";
		} else {
			imageClass = "image-container ";
		}
		for (let index in postImages) {
			let imageURL = postImages[index].imagePreviewUrl;
			if (postImages[index].imagePreviewUrl === undefined) {
				imageURL = postImages[index].url;
			}
			let imageTag = (
				<div key={index} className={imageClass} onClick={event => this.removePhoto(index)}>
					<img key={index} src={imageURL} alt="error" />
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
