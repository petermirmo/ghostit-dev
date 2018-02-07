import React, { Component } from "react";
import "../css/theme.css";

// BigCalendar dependencies
import BigCalendar from "react-big-calendar";
import moment from "moment";
import style from "../css/calendar.css";
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

// Calendar navbar variables
var allNavBarGlobal = false;
var facebookNavBarGlobal = false;
var twitterNavBarGlobal = false;
var linkedinNavBarGlobal = false;
var blogNavBarGlobal = false;
var emailNavBarGlobal = false;

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn
        }));
    }
    render() {
        return (
            <div>
                <ul>
                    <li onClick={() => navBar("All")}>
                        <a id="calendarNavBarAll" className="active">
                            All
                        </a>
                    </li>
                    <li onClick={() => navBar("Facebook")}>
                        <a id="calendarNavBarFacebook">Facebook</a>
                    </li>
                    <li onClick={() => navBar("Twitter")}>
                        <a id="calendarNavBarTwitter">Twitter</a>
                    </li>
                    <li onClick={() => navBar("Linkedin")}>
                        <a id="calendarNavBarLinkedin">Linkedin</a>
                    </li>
                    <li onClick={() => navBar("WebsiteBlog")}>
                        <a id="calendarNavBarWebsiteBlog">Website Blogs</a>
                    </li>
                    <li onClick={() => navBar("EmailNewsletter")}>
                        <a id="calendarNavBarEmailNewsletter">
                            Email Newsletter
                        </a>
                    </li>
                </ul>
                <br />
                <BigCalendar
                    selectable
                    className="big-calendar"
                    {...this.props}
                    events={[]}
                    step={60}
                    defaultDate={new Date()}
                    style={style}
                    onSelectSlot={() => openModal()}
                />
            </div>
        );
    }
}
function openModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function navBar(navBarClickedSocialMedia) {
    var allNavBar = document.getElementById("calendarNavBarAll");
    var facebookNavBar = document.getElementById("calendarNavBarFacebook");
    var twitterNavBar = document.getElementById("calendarNavBarTwitter");
    var linkedinNavBar = document.getElementById("calendarNavBarLinkedin");
    var blogNavBar = document.getElementById("calendarNavBarWebsiteBlog");
    var emailNavBar = document.getElementById("calendarNavBarEmailNewsletter");

    if (navBarClickedSocialMedia === "All") {
        if (allNavBarGlobal) {
            //if "All" content is on, turn it off
            allNavBar.classList.remove("active");
            allNavBarGlobal = false;
        } else {
            //turn all tabs off
            facebookNavBar.classList.remove("active");
            twitterNavBar.classList.remove("active");
            linkedinNavBar.classList.remove("active");
            blogNavBar.classList.remove("active");
            emailNavBar.classList.remove("active");
            facebookNavBarGlobal = false;
            twitterNavBarGlobal = false;
            linkedinNavBarGlobal = false;
            blogNavBarGlobal = false;
            emailNavBarGlobal = false;

            //turn "All" content on
            allNavBar.className += "active";
            allNavBarGlobal = true;
        }
    } else if (navBarClickedSocialMedia === "Facebook") {
        if (facebookNavBarGlobal) {
            facebookNavBar.classList.remove("active");
            facebookNavBarGlobal = false;
        } else {
            allNavBar.classList.remove("active");
            allNavBarGlobal = false;

            facebookNavBar.className += "active";
            facebookNavBarGlobal = true;
        }
        //if its already on turn it off
    } else if (navBarClickedSocialMedia === "Twitter") {
        if (twitterNavBarGlobal) {
            twitterNavBar.classList.remove("active");
            twitterNavBarGlobal = false;
        } else {
            allNavBar.classList.remove("active");
            allNavBarGlobal = false;

            twitterNavBar.className += "active";
            twitterNavBarGlobal = true;
        }
    } else if (navBarClickedSocialMedia === "Linkedin") {
        if (linkedinNavBarGlobal) {
            linkedinNavBar.classList.remove("active");
            linkedinNavBarGlobal = false;
        } else {
            allNavBar.classList.remove("active");
            allNavBarGlobal = false;

            linkedinNavBar.className += "active";
            linkedinNavBarGlobal = true;
        }
    } else if (navBarClickedSocialMedia === "WebsiteBlog") {
        if (blogNavBarGlobal) {
            blogNavBar.classList.remove("active");
            blogNavBarGlobal = false;
        } else {
            allNavBar.classList.remove("active");
            allNavBarGlobal = false;

            blogNavBar.className += "active";
            blogNavBarGlobal = true;
        }
    } else if (navBarClickedSocialMedia === "EmailNewsletter") {
        if (emailNavBarGlobal) {
            emailNavBar.classList.remove("active");
            emailNavBarGlobal = false;
        } else {
            allNavBar.classList.remove("active");
            allNavBarGlobal = false;

            emailNavBar.className += "active";
            emailNavBarGlobal = true;
        }
    }

    return;
}
export default Calendar;
