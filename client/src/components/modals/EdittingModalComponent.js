import React, { Component } from "react";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";

import "../../css/theme.css";
import DatePicker from "../DatePickerComponent.js";
import TimePicker from "../TimePickerComponent.js";
import Carousel from "../divs/Carousel.js";

class EdittingModal extends Component {
    state = {
        postID: "",
        activeTab: "",
        link: "",
        linkImagesArray: [],
        linkImage: "",
        accountType: "",
        postImages: [],
        postingToAccountID: "",
        postingDate: undefined,
        imagesToDelete: [],
        status: ""
    };

    constructor(props) {
        super(props);

        this.removePhoto = this.removePhoto.bind(this);
        this.linkPreviewSetState = this.linkPreviewSetState.bind(this);
    }
    initialize(post) {
        console.log(post);
        // Initialize textarea text
        if (post.title === "(no content)") {
        } else {
            document.getElementById("edittingTextarea").value = post.title;
        }
        // Get post from database and update state
        axios.get("/api/post/" + post._id).then(res => {
            var post = res.data;
            this.setState({
                postID: post._id,
                postImages: post.images,
                activeTab: post.socialType,
                accountType: post.accountType,
                postingToAccountID: post.accountID,
                link: post.link,
                linkImage: post.linkImage,
                postingDate: post.postingDate,
                status: post.status
            });
            this.refs.carousel.findLink(post.content);
        });
    }

    canShowLinkPreview(socialMedia) {
        if (socialMedia === "facebook") {
            return true;
        } else if (socialMedia === "twitter") {
            return false;
        } else if (socialMedia === "linkedin") {
            return true;
        } else if (socialMedia === "instagram") {
            return false;
        }
    }
    canEditLinkPreview(socialMedia) {
        if (socialMedia === "facebook") {
            return false;
        } else if (socialMedia === "twitter") {
            return false;
        } else if (socialMedia === "linkedin") {
            return true;
        } else if (socialMedia === "instagram") {
            return false;
        }
    }

    showImages(event) {
        var images = event.target.files;

        // Add current images to the images the user is adding to make sure is less than 4
        var currentImages = this.state.postImages;
        var amountOfImages = currentImages.length + images.length;

        // Check to make sure there are not more than 4 Images
        if (amountOfImages > 4) {
            alert("You have more than 4 images! Please try again");
            return;
        }

        // Check to make sure each image is under 5MB
        for (var index = 0; index < images.length; index++) {
            if (images[index].size > 5000000) {
                alert(
                    "File size on one or more photos is over 5MB( Please try again"
                );
                return;
            }
        }

        // Save each image to state
        var imagesArray = currentImages;
        for (index = 0; index < images.length; index++) {
            let reader = new FileReader();
            let image = images[index];
            reader.onloadend = () => {
                var imageObject = {
                    image: image,
                    relativeURL: reader.result
                };
                imagesArray.push(imageObject);
                if (index === images.length) {
                    this.setState({ postImages: imagesArray });
                }
            };

            reader.readAsDataURL(image);
        }
    }
    removePhoto(event) {
        var currentImages = this.state.postImages;
        // <i> tag can be clicked as well as image tag, so this code checks siblings to make sure we got the <img> tag
        var clickedImage = event.target.previousElementSibling;
        if (clickedImage === null) {
            clickedImage = event.target;
        }

        // ID of img tag is "image" + index in the array ex. image1
        // We will remove "image" leaving us with just the index
        var indexOfRemovalImage = clickedImage.id.replace("image", "");

        // Make sure imagee is in images to delete array
        // Only add if it is not an object. If it is an object it is not in the database yet
        if (currentImages[indexOfRemovalImage].relativeURL === undefined) {
            this.state.imagesToDelete.push(currentImages[indexOfRemovalImage]);
        }

        // Remove image from current images
        currentImages.splice(indexOfRemovalImage, 1);

        // Update state
        this.setState({ postImages: currentImages });
    }
    savePost() {
        // Get content of post
        var content = document.getElementById("edittingTextarea").value;

        // Get current images
        var currentImages = this.state.postImages;

        // Get date of post
        var datePickerDate = document
            .getElementById("edittingDatePickerPopUp")
            .getAttribute("getdate");

        // Get time of post
        var timePickerTime = document
            .getElementById("edittingTimePickerPopUp")
            .getAttribute("gettime");

        // Combine time and date into one date variable
        var postingDate = new Date(datePickerDate);
        var postingTime = new Date(timePickerTime);
        postingDate.setHours(postingTime.getHours());
        postingDate.setMinutes(postingTime.getMinutes());

        // Get carousel html element
        var carousel;
        if (this.canEditLinkPreview(this.state.activeTab)) {
            carousel = document.getElementById("editLinkCarousel");
        }
        // Make sure that the date is not in the past
        var currentDate = new Date();
        if (postingDate < currentDate) {
            alert(
                "Time travel is not yet possible! Please select a date in the future not in the past!"
            );
            return;
        }
        var link = this.state.link;
        // If link previews are allowed get src of active image from carousel
        var linkPreviewImage = this.state.linkImage;
        if (link !== "") {
            if (carousel) {
                // Get active image from carousel
                linkPreviewImage = document.getElementsByClassName(
                    "owl-item active center"
                )[0].children[0].children[0].src;
            }
        }
        // Get account id to post to
        var accountIdToPostTo = this.state.postingToAccountID;

        if (accountIdToPostTo === "") {
            alert("Please select an account to post to!");
            return;
        }

        // Now we have content of post, date (and time), account ID to post to, link preview image src and the link url

        // Check to make sure we have atleast a link, content, or an image
        if (content === "" && link === "" && currentImages === []) {
            alert(
                "You are trying to create an empty post. We will not let you shoot yourself in the foot."
            );
            return;
        }

        // Everything seems okay, save post to database!
        axios
            .post("/api/post/update/" + this.state.postID, {
                accountID: accountIdToPostTo,
                content: content,
                postingDate: postingDate,
                link: link,
                linkImage: linkPreviewImage,
                accountType: this.state.accountType,
                socialType: this.state.activeTab
            })
            .then(res => {
                var post = res.data;

                var newImages = [];
                var imagesToDelete = this.state.imagesToDelete;
                for (var i = 0; i < currentImages.length; i++) {
                    // If relativeURL is not undefined this is a new photo and we need to upload it to the server
                    if (currentImages[i].relativeURL !== undefined) {
                        newImages.push(currentImages[i].image);
                    }
                }
                // We now have two arrays. One with all images we need to add and one with all images we need to delete.
                // Images are saved after post, becuse they are handled so differently in the database
                // Text and images do not go well together

                // First we will delete the necessary images from cloudinary and our database
                if (post._id && imagesToDelete.length !== 0) {
                    axios
                        .post(
                            "/api/post/delete/images/" + post._id,
                            imagesToDelete
                        )
                        .then(res => {
                            // After images have been deleted, we will save new images
                            // Add all new images
                            if (post._id && newImages.length !== 0) {
                                // Make sure post actually saved
                                // Now we add images

                                // Images must be uploaded via forms
                                var formData = new FormData();
                                formData.append("postID", post._id);

                                // Attach all images to formData
                                for (i = 0; i < newImages.length; i++) {
                                    formData.append("file", newImages[i]);
                                }
                                // Make post request for images
                                axios
                                    .post("/api/post/images", formData)
                                    .then(res => {
                                        this.finishSave();
                                        return;
                                    });
                            } else {
                                this.finishSave();
                                return;
                            }
                        });
                } else if (post._id && newImages.length !== 0) {
                    // If there are no images to delete we simply need to add new images
                    // Add all new images
                    // Make sure post actually saved
                    // Now we add images

                    // Images must be uploaded via forms
                    var formData = new FormData();
                    formData.append("postID", post._id);

                    // Attach all images to formData
                    for (i = 0; i < newImages.length; i++) {
                        formData.append("file", newImages[i]);
                    }
                    // Make post request for images
                    axios.post("/api/post/images", formData).then(res => {
                        this.finishSave();
                        return;
                    });
                } else {
                    this.finishSave();
                    return;
                }
            });
    }
    finishSave() {
        document.getElementById("edittingModal").style.display = "none";
        this.props.updateCalendarPosts();
    }
    linkPreviewSetState(link, imagesArray) {
        this.setState({ link: link, linkImagesArray: imagesArray });
    }

    render() {
        // Determine if post can be editted or not
        var imageClass;
        var imageOnClick;
        var canEditLinkPreview;
        var textareaDiv;
        var dateEdittingDisabled;
        if (this.state.status === "pending") {
            imageClass = "delete-image-container image-container";
            imageOnClick = this.removePhoto();
            canEditLinkPreview = this.canEditLinkPreview(this.state.activeTab);
            textareaDiv = (
                <textarea
                    id="edittingTextarea"
                    className="postingTextArea"
                    rows={5}
                    placeholder="Success doesn't write itself!"
                    onChange={event =>
                        this.refs.carousel.findLink(event.target.value)
                    }
                />
            );
            dateEdittingDisabled = false;
        } else {
            imageClass = "image-container";
            imageOnClick = {};
            canEditLinkPreview = false;
            textareaDiv = (
                <textarea
                    id="edittingTextarea"
                    className="postingTextArea"
                    rows={5}
                    placeholder="Success doesn't write itself!"
                    onChange={event =>
                        this.refs.carousel.findLink(event.target.value)
                    }
                    readOnly
                />
            );
            dateEdittingDisabled = true;
        }
        // Show preview images
        var imagesDiv = [];
        var currentImages = this.state.postImages;
        for (var index4 in currentImages) {
            var urlToImage;
            if (currentImages[index4].relativeURL !== undefined) {
                urlToImage = currentImages[index4].relativeURL;
            } else {
                urlToImage = currentImages[index4].imageURL;
            }
            var imageTag = (
                <div
                    key={index4}
                    className={imageClass}
                    onClick={event => imageOnClick}
                >
                    <img
                        id={"image" + index4.toString()}
                        key={index4}
                        src={urlToImage}
                        alt="error"
                    />
                    <i className="fa fa-times fa-3x" />
                </div>
            );
            imagesDiv.push(imageTag);
        }
        var carousel = (
            <Carousel
                linkPreviewCanEdit={canEditLinkPreview}
                linkPreviewCanShow={this.canShowLinkPreview(
                    this.state.activeTab
                )}
                ref="carousel"
                updateParentState={this.linkPreviewSetState}
                id="editLinkCarousel"
            />
        );

        var modalBody;
        var modalFooter;
        var date;
        if (this.state.postingDate !== undefined) {
            date = new Date(this.state.postingDate);
        }
        var fileUploadDiv;
        if (this.state.status === "pending") {
            if (currentImages.length < 4) {
                fileUploadDiv = (
                    <div>
                        <label
                            htmlFor="edit-file-upload"
                            className="custom-file-upload"
                        >
                            Upload Images! (Up to four)
                        </label>
                        <input
                            id="edit-file-upload"
                            type="file"
                            onChange={event => this.showImages(event)}
                            multiple
                        />
                    </div>
                );
            }
        }

        modalBody = (
            <div className="modal-body">
                {textareaDiv}
                {fileUploadDiv}
                {imagesDiv}
                {carousel}
                <DatePicker
                    clickedCalendarDate={date}
                    id="edittingDatePickerPopUp"
                    canEdit={dateEdittingDisabled}
                />
                <TimePicker
                    timeForPost={date}
                    id="edittingTimePickerPopUp"
                    canEdit={dateEdittingDisabled}
                />
            </div>
        );
        if (this.state.status === "pending") {
            modalFooter = (
                <div className="modal-footer">
                    <button onClick={() => this.savePost()}>Save Post</button>
                </div>
            );
        }

        return (
            <div id="edittingModal" className="modal">
                <div className="modal-content" style={{ textAlign: "center" }}>
                    {modalBody}
                    {modalFooter}
                </div>
            </div>
        );
    }
}

export default EdittingModal;
