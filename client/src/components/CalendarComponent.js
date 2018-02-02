import React, { Component } from "react";
import "../css/theme.css";

// BigCalendar dependencies
import BigCalendar from "react-big-calendar";
import moment from "moment";
import style from "react-big-calendar/lib/css/react-big-calendar.css";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

// Calendar navbar variables
var facebookNavBar = false;
var twitterNavBar = false;
var linkedinNavBar = false;
var allNavBar = true;

function navBar(e) {
    var h;
    console.log(e);
    return;
    document.getElementById("calendarNavBarAll");
    document.getElementById("calendarNavBarFacebook");
    document.getElementById("calendarNavBarTwitter");
    document.getElementById("calendarNavBarLinkedin");
    if (h === "All") {
        if (allNavBar) {
            //if all content is on turn it off
            document.getElementById("calendarNavBarAll").style.backgroundColor =
                "#f3f3f3";
        } else {
            //turn all tabs off
            document.getElementById(
                "calendarNavBarFacebook"
            ).style.backgroundColor =
                "#f3f3f3";
            document.getElementById(
                "calendarNavBarTwitter"
            ).style.backgroundColor =
                "#f3f3f3";
            document.getElementById(
                "calendarNavBarLinkedin"
            ).style.backgroundColor =
                "#f3f3f3";

            //turn all content on
            document.getElementById("calendarNavBarAll").style.backgroundColor =
                "#3498db";
        }
        return;
    }

    if (true) {
        //if its already on turn it off
    } else {
        //if all content is on turn it off
    }
}

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
                    <li onClick={() => navBar()}>
                        <a id="calendarNavBarAll">All</a>
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
                    onSelectSlot={slotInfo =>
                        alert(
                            `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                                `\nend: ${slotInfo.end.toLocaleString()}` +
                                `\naction: ${slotInfo.action}`
                        )
                    }
                />
            </div>
        );
    }
}

export default Calendar;
