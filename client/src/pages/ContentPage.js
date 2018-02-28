import React, { Component } from "react";

import "../css/theme.css";
import Header from "../components/HeaderComponent";
import Calendar from "../components/CalendarComponent";
import SideBar from "../components/SideBar";

class Content extends Component {
    render() {
        return (
            <div id="wrapper">
                <SideBar />
                <Header activePage="content" />

                <div id="main">
                    <Calendar />
                </div>
            </div>
        );
    }
}

export default Content;
