import React, { Component } from "react";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";

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
        linkPreviewCanEdit: "false"
    };
    constructor(props) {
        super(props);
        this.getUserAccounts();
        this.getDataFromURL = this.getDataFromURL.bind(this);
        this.switchTabs = this.switchTabs.bind(this);
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
                    linkImagesArray: []
                });
            } else if (socialMedia === "twitter") {
                this.setState({
                    activeTab: socialMedia,
                    linkPreviewCanShow: false,
                    linkPreviewCanEdit: false,
                    linkImagesArray: []
                });
            } else if (socialMedia === "linkedin") {
                this.setState({
                    activeTab: socialMedia,
                    linkPreviewCanShow: true,
                    linkPreviewCanEdit: true,
                    linkImagesArray: []
                });
            } else if (socialMedia === "instagram") {
                this.setState({
                    activeTab: socialMedia,
                    linkPreviewCanShow: false,
                    linkPreviewCanEdit: false,
                    linkImagesArray: []
                });
            }
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
            this.setState({ linkImagesArray: res.data });
        });
    }
    savePost() {
        var content = document.getElementById("contentPostingTextarea").value;
        var date = document
            .getElementById("contentDatePickerPopUp")
            .getAttribute("getdate");
        var time = document
            .getElementById("contentTimePickerPopUp")
            .getAttribute("gettime");
        var carousel;
        if (this.state.linkPreviewCanShow) {
            carousel = document.getElementById("linkCarousel");
        }
        var postingDate = new Date(date);
        var postingTime = new Date(time);
        postingDate.setTime(postingTime.getTime());

        var currentDate = new Date();
        console.log(currentDate);
        console.log("\n");
        console.log(content);
        console.log("\n");
        console.log(postingDate);
        console.log("\n");
        console.log(content);
        console.log("\n");
        if (carousel) {
            // Get active image from carousel
            var here = document.getElementsByClassName(
                "owl-item active center"
            )[0].children[0].children[0].src;
            console.log(here);
        }
    }

    getUserAccounts() {
        // Get all connected accounts of the user
        axios.get("/api/accounts").then(res => {
            // Set user's accounts to state
            this.setState({ accounts: res.data });
        });
    }

    render() {
        var linkImages = this.state.linkImagesArray;
        var imgTags = [];
        var carousel;

        for (var index in linkImages) {
            // If we can't show link preview, break
            if (this.state.linkPreviewCanShow === false) {
                break;
            }
            imgTags.push(
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
                        {imgTags}
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
                        {imgTags}
                    </OwlCarousel>
                );
            }
        }
        var modalBody;
        var activePageAccountsArray = [];
        var accountsListDiv = [];
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
                    key={index3}
                    style={{
                        backgroundColor: "var(--blue-theme-color)",
                        width: "25%"
                    }}
                >
                    <button>{name}</button>
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
                        rows="5"
                        placeholder="Success doesn't write itself!"
                        onChange={event => this.findLink(event.target.value)}
                    />
                    <div style={{ width: "100%" }} className="center">
                        {accountsListDiv}
                    </div>
                    {carousel}

                    <DatePicker
                        clickedCalendarDate={this.props.clickedCalendarDate}
                    />
                    <TimePicker timeForPost={this.props.timeForPost} />
                    <button onClick={() => this.savePost()}>Save Post</button>
                </div>
            );
        } else {
            modalBody = (
                <div className="modal-body center">
                    <h4>Connect {this.state.activeTab} Profile first!</h4>
                </div>
            );
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

                    <div className="modal-footer" />
                </div>
            </div>
        );
    }
}

export default Modal;
