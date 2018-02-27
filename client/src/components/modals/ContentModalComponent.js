import React, { Component } from "react";
import axios from "axios";
import { Carousel } from "react-bootstrap";

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
        linkImagesArray: [],
        index: 0,
        direction: null
    };
    constructor(props) {
        super(props);

        this.getDataFromURL = this.getDataFromURL.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
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
                tabs[index].className = "column2";
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
    handleSelect(selectedIndex, e) {
        alert(`selected=${selectedIndex}, direction=${e.direction}`);
        this.setState({
            index: selectedIndex,
            direction: e.direction
        });
    }
    render() {
        const { index, direction } = this.state;

        var linkImages = this.state.linkImagesArray;
        var imgTags = [];
        var carousel;

        for (var index2 in linkImages) {
            console.log(linkImages[index2]);
        }
        return (
            <div id="postingModal" className="modal2">
                <div className="modal-content2" style={{ textAlign: "center" }}>
                    <div className="modal-header2">
                        <div className="row2">
                            <div className="column2 active-column">
                                <button
                                    onClick={event => this.switchTabs(event)}
                                >
                                    Facebook
                                </button>
                            </div>

                            <div className="column2">
                                <button
                                    onClick={event => this.switchTabs(event)}
                                >
                                    Twitter
                                </button>
                            </div>

                            <div className="column2">
                                <button
                                    onClick={event => this.switchTabs(event)}
                                >
                                    Linkedin
                                </button>
                            </div>

                            <div
                                className="column2"
                                onClick={event => this.switchTabs(event)}
                            >
                                <button>Instagram</button>
                            </div>
                        </div>
                    </div>

                    <div className="modal-body2">
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
                    </div>
                    <div style={{ maxHeight: "200px" }}>
                        <Carousel
                            activeIndex={index}
                            direction={direction}
                            onSelect={this.handleSelect}
                        >
                            <Carousel.Item>
                                <img
                                    width={100}
                                    height={100}
                                    alt="900x500"
                                    src="https://uploads-ssl.webflow.com/5982039167058400011c5a52/5a89ea23d9716c0001a50a0f_product%20image.png"
                                />
                                <Carousel.Caption>
                                    <h3>First slide label</h3>
                                    <p>
                                        Nulla vitae elit libero, a pharetra
                                        augue mollis interdum.
                                    </p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    width={100}
                                    height={100}
                                    alt="900x500"
                                    src="https://uploads-ssl.webflow.com/5982039167058400011c5a52/5a89ea23d9716c0001a50a0f_product%20image.png"
                                />
                                <Carousel.Caption>
                                    <h3>Second slide label</h3>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit.
                                    </p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    width={100}
                                    height={100}
                                    alt="900x500"
                                    src="https://uploads-ssl.webflow.com/5982039167058400011c5a52/5a89ea23d9716c0001a50a0f_product%20image.png"
                                />
                                <Carousel.Caption>
                                    <h3>Third slide label</h3>
                                    <p>
                                        Praesent commodo cursus magna, vel
                                        scelerisque nisl consectetur.
                                    </p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </div>
                    <div className="modal-footer2" />
                </div>
            </div>
        );
    }
}

export default Modal;
