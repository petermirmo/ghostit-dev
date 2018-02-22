import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "../css/theme.css";
import "font-awesome/css/font-awesome.min.css";

class Header extends Component {
    state = {
        isLoggedIn: true
    };
    constructor(props) {
        super(props);

        // Logged in check
        axios
            .get("/api/isUserSignedIn")
            .then(res => this.setState({ isLoggedIn: res.data }));
    }
    openSideBar() {
        document.getElementById("mySidebar").style.width = "25%";
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("main").style.marginLeft = "25%";
    }
    render() {
        const { isLoggedIn } = this.state;
        if (!isLoggedIn) {
            return <Redirect to="/" />;
        }
        return (
            <header>
                <div className="navbar">
                    <div className="dropdown">
                        <button className="dropbtn">Profile</button>
                        <div className="dropdown-content">
                            <a href="/profile">Profile</a>
                            <a href="/api/logout">Logout</a>
                        </div>
                    </div>
                    <a className="active" href="/content">
                        Content
                    </a>
                    <button
                        id="navBarOpen"
                        onClick={() => this.openSideBar()}
                        className="fa fa-bars fa-2x"
                    />
                </div>
            </header>
        );
    }
}

export default Header;
