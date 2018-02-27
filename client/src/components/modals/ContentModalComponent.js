import React, { Component } from "react";
import axios from "axios";
import OwlCarousel from "react-owl-carousel3";

import "../../css/theme.css";
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
function savePost() {
    //var content = document.getElementById("contentPostingTextarea").value;
    var date = document
        .getElementById("contentDatePickerPopUp")
        .getAttribute("getdate");
    var time = document
        .getElementById("contentTimePickerPopUp")
        .getAttribute("gettime");

    var postingDate = new Date(date);
    var postingTime = new Date(time);
    postingDate.setTime(postingTime.getTime());
}

class Modal extends Component {
    state = {
        postContent: "",
        postImages: "",
        postLink: "",
        postLinkImage: "",
        linkImagesArray: []
    };
    constructor(props) {
        super(props);

        this.getDataFromURL = this.getDataFromURL.bind(this);
    }
    switchTabs(event) {
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
        }
    }
    findLink(textAreaString) {
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

    render() {
        var linkImages = this.state.linkImagesArray;
        var imgTags = [];
        var carousel;

        for (var index in linkImages) {
            console.log(linkImages[index]);
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
                        style={{
                            maxHeight: "200px",
                            boxShadow: " 0 0 20px 0"
                        }}
                        src={linkImages[index]}
                    />
                </div>
            );
            carousel = (
                <OwlCarousel
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
        }
        return (
            <div id="postingModal" className="modal">
                <div className="modal-content" style={{ textAlign: "center" }}>
                    <div className="modal-header">
                        <div className="row">
                            <div className="column active-column">
                                <button
                                    onClick={event => this.switchTabs(event)}
                                >
                                    Facebook
                                </button>
                            </div>

                            <div className="column">
                                <button
                                    onClick={event => this.switchTabs(event)}
                                >
                                    Twitter
                                </button>
                            </div>

                            <div className="column">
                                <button
                                    onClick={event => this.switchTabs(event)}
                                >
                                    Linkedin
                                </button>
                            </div>

                            <div
                                className="column"
                                onClick={event => this.switchTabs(event)}
                            >
                                <button>Instagram</button>
                            </div>
                        </div>
                    </div>

                    <div className="modal-body">
                        <textarea
                            id="contentPostingTextarea"
                            className="postingTextArea"
                            rows="10"
                            placeholder="Success doesn't write itself!"
                            onChange={event =>
                                this.findLink(event.target.value)
                            }
                        />
                        <DatePicker
                            clickedCalendarDate={this.props.clickedCalendarDate}
                        />
                        <TimePicker timeForPost={this.props.timeForPost} />
                        <button className="center" onClick={() => savePost()}>
                            Save Post
                        </button>
                        {carousel}
                    </div>

                    <div className="modal-footer" />
                </div>
            </div>
        );
    }
}

export default Modal;
