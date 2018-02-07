import React, { Component } from "react";
import "../css/theme.css";
import Header from "../components/HeaderComponent";
import Calendar from "../components/CalendarComponent";
import Modal from "../components/Modal";

class Content extends Component {
    render() {
        return (
            <div id="wrapper">
                <Header />
                <Modal />
                <Calendar />
            </div>
        );
    }
}

export default Content;
