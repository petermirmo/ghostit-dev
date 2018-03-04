import React, { Component } from "react";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import "font-awesome/css/font-awesome.min.css";

import "../../css/theme.css";
import "../../css/carousel.css";
import DatePicker from "../DatePickerComponent.js";
import TimePicker from "../TimePickerComponent.js";
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    // Turn off posting modal
    var postingModal = document.getElementById("postingModal");
    if (event.target === postingModal) {
        postingModal.style.display = "none";
        return;
    }

    // Turn off facebook pages modal
    var facebookModal = document.getElementById("addPagesOrGroupsModal");
    if (event.target === facebookModal) {
        facebookModal.style.display = "none";
        return;
    }
};

class Modal extends Component {
    state = {
        accounts: [],
        activeTab: "facebook",
        linkImagesArray: [],
        linkPreviewCanShow: "true",
        linkPreviewCanEdit: "false",
        postingToAccountId: "",
        link: "",
        postImages: []
    };
    constructor(props) {
        super(props);
        this.getUserAccounts();
        this.getDataFromURL = this.getDataFromURL.bind(this);
        this.switchTabs = this.switchTabs.bind(this);
        this.removePhoto = this.removePhoto.bind(this);
    }
    switchTabs(event, socialMedia) {
        if (socialMedia === "instagram") {
            return;
        }
        var clickedNavBarTab = event.target.parentNode;

        // Check if this is the active class
        if (clickedNavBarTab.classList.contains("active-column")) {
            // If it is already active tab, do nothing
            return;
        } else {
            this.clearActiveDivs();
            // Take away active class from all other tabs
            var tabs = document.getElementsByClassName("active-column");
            for (var index = 0; index < tabs.length; index++) {
                tabs[index].className = "column";
            }
            clickedNavBarTab.className += " active-column";
            if (socialMedia === "facebook") {
                this.setState({
                    activeTab: socialMedia,
                    linkPreviewCanShow: true,
                    linkPreviewCanEdit: false,
                    linkImagesArray: [],
                    postingToAccountId: ""
                });
            } else if (socialMedia === "twitter") {
                this.setState({
                    activeTab: socialMedia,
                    linkPreviewCanShow: false,
                    linkPreviewCanEdit: false,
                    linkImagesArray: [],
                    postingToAccountId: ""
                });
            } else if (socialMedia === "linkedin") {
                this.setState({
                    activeTab: socialMedia,
                    linkPreviewCanShow: true,
                    linkPreviewCanEdit: true,
                    linkImagesArray: [],
                    postingToAccountId: ""
                });
            } else if (socialMedia === "instagram") {
                this.setState({
                    activeTab: socialMedia,
                    linkPreviewCanShow: false,
                    linkPreviewCanEdit: false,
                    linkImagesArray: [],
                    postingToAccountId: ""
                });
            }
        }
    }
    getUserAccounts() {
        // Get all connected accounts of the user
        axios.get("/api/accounts").then(res => {
            // Set user's accounts to state
            this.setState({ accounts: res.data });
        });
    }
    postingAccountNav(event) {
        var clickedAccount;
        // Make sure to get the actual div to set as active
        // Not just the h4 or something
        if (
            event.target.parentNode.classList.contains(
                "connected-accounts-posting-div"
            )
        ) {
            clickedAccount = event.target.parentNode;
        } else {
            clickedAccount = event.target;
        }

        this.clearActiveDivs();
        // Add active class to clicked div
        clickedAccount.className += " common-active";
        this.setState({ postingToAccountId: clickedAccount.id });
    }
    clearActiveDivs() {
        this.setState({ postingToAccountId: "" });

        // Clear all divs to unactive
        var divArray = document.getElementsByClassName(
            "connected-accounts-posting-div"
        );
        for (var index in divArray) {
            if (divArray[index].classList)
                divArray[index].classList.remove("common-active");
        }
    }

    findLink(textAreaString) {
        // If we can't show link preview, return
        if (this.state.linkPreviewCanShow === false) {
            return;
        }
        // Url regular expression
        var urlRegularExpression = /((http|ftp|https):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

        // Finds url
        var match = urlRegularExpression.exec(textAreaString);
        var link;

        // Adjusts entered in url for consistent url starts. EX: "ghostit.co" would convert to "http://ghostit.co"
        if (match !== null) {
            if (
                match[0].substring(0, 7) === "http://" ||
                match[0].substring(0, 8) === "https://"
            ) {
                link = match[0];
            } else {
                link = "http://" + match[0];
            }
            this.getDataFromURL(link);
        }
    }
    getDataFromURL(link) {
        axios.post("/api/link", { link: link }).then(res => {
            this.setState({ link: link, linkImagesArray: res.data });
        });
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
                    imagePreviewUrl: reader.result
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
        var content = document.getElementById("contentPostingTextarea").value;

        // Get current images
        var currentImages = [];
        for (var i = 0; i < this.state.postImages.length; i++) {
            currentImages.push(this.state.postImages[i].image);
        }

        // Get date of post
        var datePickerDate = document
            .getElementById("contentDatePickerPopUp")
            .getAttribute("getdate");

        // Get time of post
        var timePickerTime = document
            .getElementById("contentTimePickerPopUp")
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
        var accountIdToPostTo = this.state.postingToAccountId;

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
            .post("/api/post", {
                accountID: accountIdToPostTo,
                content: content,
                link: link,
                linkImage: linkPreviewImage
            })
            .then(res => {
                // Now we need to save images for post, Images are saved after post
                // Becuse they are handled so differently in the database
                // Text and images do not go well together
                var post = res.data;
                if (post._id && currentImages !== []) {
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
                    axios.post("/api/post/images", formData).then(res => {
                        console.log(res);
                    });
                }
            });
    }

    render() {
        var linkImages = this.state.linkImagesArray;
        var linkPreviewImageTag = [];
        var carousel;

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
                        src={this.state.postImages[index4].imagePreviewUrl}
                        alt="error"
                    />
                    <i className="fa fa-times fa-3x" />
                </div>
            );
            imagesDiv.push(imageTag);
        }

        for (var index in linkImages) {
            // If we can't show link preview, break
            if (this.state.linkPreviewCanShow === false) {
                break;
            }
            linkPreviewImageTag.push(
                <div
                    className="item"
                    key={index}
                    style={{
                        height: "150",
                        border: "2px solid var(--black-theme-color)"
                    }}
                >
                    <img
                        alt=" error :("
                        style={{
                            maxHeight: "100px",
                            boxShadow: " 0 0 20px 0"
                        }}
                        src={linkImages[index]}
                    />
                </div>
            );
            if (this.state.linkPreviewCanEdit === true) {
                carousel = (
                    <OwlCarousel
                        id="linkCarousel"
                        style={{
                            float: "left",
                            width: "40%"
                        }}
                        items={1}
                        className="owl-theme center"
                        center={true}
                        loop
                        margin={10}
                        nav
                    >
                        {linkPreviewImageTag}
                    </OwlCarousel>
                );
            } else {
                carousel = (
                    <OwlCarousel
                        id="linkCarousel"
                        style={{
                            float: "left",
                            width: "40%"
                        }}
                        items={1}
                        className="owl-theme center"
                        center={true}
                        loop
                        margin={10}
                        nav={false}
                        dots={false}
                        mouseDrag={false}
                        touchDrag={false}
                        pullDrag={false}
                        freeDrag={false}
                    >
                        {linkPreviewImageTag}
                    </OwlCarousel>
                );
            }
        }
        var modalBody;
        var activePageAccountsArray = [];
        var accountsListDiv = [];
        var modalFooter;
        // Account divs
        // Loop through all account
        for (var index2 in this.state.accounts) {
            // Check if the account is the same as active tab
            if (
                this.state.accounts[index2].socialType === this.state.activeTab
            ) {
                activePageAccountsArray.push(this.state.accounts[index2]);
            }
        }
        // To select which account to post to
        for (var index3 in activePageAccountsArray) {
            var name =
                activePageAccountsArray[index3].givenName
                    .charAt(0)
                    .toUpperCase() +
                activePageAccountsArray[index3].givenName.slice(1);
            if (activePageAccountsArray[index3].familyName) {
                name +=
                    " " +
                    activePageAccountsArray[index3].familyName
                        .charAt(0)
                        .toUpperCase() +
                    activePageAccountsArray[index3].familyName.slice(1);
            }
            // Push div to array
            var div = (
                <div
                    id={activePageAccountsArray[index3]._id}
                    key={index3}
                    className="connected-accounts-posting-div"
                    onClick={event => this.postingAccountNav(event)}
                >
                    <h4>{name}</h4>
                    <p>{activePageAccountsArray[index3].accountType}</p>
                </div>
            );
            accountsListDiv.push(div);
        }

        if (activePageAccountsArray.length !== 0) {
            modalBody = (
                <div className="modal-body">
                    <textarea
                        id="contentPostingTextarea"
                        className="postingTextArea"
                        rows={5}
                        placeholder="Success doesn't write itself!"
                        onChange={event => this.findLink(event.target.value)}
                    />
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Upload Images! (Up to four)
                    </label>
                    {imagesDiv}

                    <input
                        id="file-upload"
                        type="file"
                        onChange={event => this.showImages(event)}
                        multiple
                    />
                    <h4
                        className="center"
                        style={{
                            display: "inline-block",
                            width: "100%",
                            margin: "10px",
                            padding: "0"
                        }}
                    >
                        Choose an account to post to!
                    </h4>
                    <div className="connected-accounts-container center">
                        {accountsListDiv}
                    </div>
                    {carousel}

                    <DatePicker
                        clickedCalendarDate={this.props.clickedCalendarDate}
                    />
                    <TimePicker timeForPost={this.props.timeForPost} />
                </div>
            );
            modalFooter = (
                <div className="modal-footer">
                    <button onClick={() => this.savePost()}>Save Post</button>
                </div>
            );
        } else {
            modalBody = (
                <div className="modal-body center">
                    <h4>Connect {this.state.activeTab} Profile first!</h4>
                </div>
            );
            modalFooter = <div className="modal-footer" />;
        }

        return (
            <div id="postingModal" className="modal">
                <div className="modal-content" style={{ textAlign: "center" }}>
                    <div className="modal-header">
                        <div className="row">
                            <div className="column active-column">
                                <button
                                    onClick={event =>
                                        this.switchTabs(event, "facebook")
                                    }
                                >
                                    Facebook
                                </button>
                            </div>

                            <div className="column">
                                <button
                                    onClick={event =>
                                        this.switchTabs(event, "twitter")
                                    }
                                >
                                    Twitter
                                </button>
                            </div>

                            <div className="column">
                                <button
                                    onClick={event =>
                                        this.switchTabs(event, "linkedin")
                                    }
                                >
                                    Linkedin
                                </button>
                            </div>

                            <div
                                className="column"
                                style={{
                                    background:
                                        "linear-gradient(90deg, #cd486b, #8a3ab9)"
                                }}
                                onClick={event =>
                                    this.switchTabs(event, "instagram")
                                }
                            >
                                <button>Coming Soon!</button>
                            </div>
                        </div>
                    </div>
                    {modalBody}
                    {modalFooter}
                </div>
            </div>
        );
    }
}

export default Modal;
