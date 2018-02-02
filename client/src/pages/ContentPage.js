import React, { Component } from "react";
import "../css/theme.css";
import Header from "../components/HeaderComponent";
import Calendar from "../components/CalendarComponent";

class Content extends Component {
    render() {
        return (
            <div id="wrapper">
                <Header />
                <Calendar />
            </div>
        );
    }
}

export default Content;
