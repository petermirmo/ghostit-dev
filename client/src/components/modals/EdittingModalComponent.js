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
        postingDate: undefined
    };

    constructor(props) {
        super(props);

        this.removePhoto = this.removePhoto.bind(this);
        this.linkPreviewSetState = this.linkPreviewSetState.bind(this);
    }
    initialize(post) {
        // Initialize textarea text
        if (post.title === "(no content)") {
        } else {
            document.getElementById("edittingTextarea").value = post.title;
        }
        // Get images of post from database
        this.setState({
            postID: post._id,
            postImages: post.images,
            activeTab: post.socialType,
            accountType: post.accountType,
            postingToAccountID: post.accountID,
            link: post.link,
            linkImage: post.linkImage,
            postingDate: post.postingDate
        });
        this.refs.carousel.findLink(post.title);
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
        // Check to make sure there are not more than 4 Images
        if (images.length > 4) {
            alert("You have selected more than 4 images! Please try again");
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
        var imagesArray = [];
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

        // ID of img tag is image + index in the array ex. image1
        // We will remove "image" leaving us with just the index
        var indexOfRemovalImage = clickedImage.id.replace("image", "");
        currentImages.splice(indexOfRemovalImage, 1);
        this.setState({ postImages: currentImages });
    }
    savePost() {
        // Get content of post
        var content = document.getElementById("edittingTextarea").value;

        // Get current images
        var currentImages = [];
        for (var i = 0; i < this.state.postImages.length; i++) {
            currentImages.push(this.state.postImages[i].image);
        }

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
        if (this.state.linkPreviewCanShow) {
            carousel = document.getElementById("linkCarousel");
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
        var linkPreviewImage = "";
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

                // If this is undefined it means that we need to check if any photos were removed
                if (currentImages[0] === undefined) {
                    axios
                        .post(
                            "/api/post/update/images/" + post._id,
                            this.state.postImages
                        )
                        .then(res => {
                            console.log(res);
                        });
                } else {
                    // Now we need to save images for post, Images are saved after post
                    // Becuse they are handled so differently in the database
                    // Text and images do not go well together
                    if (post._id && currentImages.length !== 0) {
                        // Make sure post actually saved
                        // Now we add images

                        // Images must be uploaded via forms
                        var formData = new FormData();
                        formData.append("postID", post._id);

                        // Attach all images to formData
                        for (var i = 0; i < currentImages.length; i++) {
                            formData.append("file", currentImages[i]);
                        }
                        // Make post request for images
                        axios
                            .post("/api/post/images", formData)
                            .then(res => {});
                    }
                }
            });
    }
    linkPreviewSetState(link, imagesArray) {
        this.setState({ link: link, linkImagesArray: imagesArray });
    }

    render() {
        // Show preview images
        var imagesDiv = [];
        for (var index4 in this.state.postImages) {
            // If image has been removed index will equal null
            var imageTag = (
                <div
                    key={index4}
                    className="delete-image-container"
                    onClick={event => this.removePhoto(event)}
                >
                    <img
                        id={"image" + index4.toString()}
                        key={index4}
                        src={this.state.postImages[index4].relativeURL}
                        alt="error"
                    />
                    <i className="fa fa-times fa-3x" />
                </div>
            );
            imagesDiv.push(imageTag);
        }

        var carousel = (
            <Carousel
                linkPreviewCanEdit={this.canEditLinkPreview(
                    this.props.post.socialType
                )}
                linkPreviewCanShow={this.canShowLinkPreview(
                    this.props.post.socialType
                )}
                ref="carousel"
                updateParentState={this.linkPreviewSetState}
            />
        );

        var modalBody;
        var modalFooter;
        var date;
        if (this.state.postingDate !== undefined) {
            date = new Date(this.state.postingDate);
        }
        modalBody = (
            <div className="modal-body">
                <textarea
                    id="edittingTextarea"
                    className="postingTextArea"
                    rows={5}
                    placeholder="Success doesn't write itself!"
                    onChange={event =>
                        this.refs.carousel.findLink(event.target.value)
                    }
                />
                <label
                    htmlFor="edit-file-upload"
                    className="custom-file-upload"
                >
                    Upload Images! (Up to four)
                </label>
                {imagesDiv}
                <input
                    id="edit-file-upload"
                    type="file"
                    onChange={event => this.showImages(event)}
                    multiple
                />
                {carousel}
                <DatePicker
                    clickedCalendarDate={date}
                    id="edittingDatePickerPopUp"
                />
                <TimePicker timeForPost={date} id="edittingTimePickerPopUp" />
            </div>
        );
        modalFooter = (
            <div className="modal-footer">
                <button onClick={() => this.savePost()}>Save Post</button>
            </div>
        );

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
