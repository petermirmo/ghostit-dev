import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "../css/theme.css";

class Header extends Component {
    state = {
        isLoggedIn: true
    };
    constructor(props) {
        super(props);
        axios
            .get("/api/isUserSignedIn")
            .then(res => this.setState({ isLoggedIn: res.data }));
    }
    render() {
        const { isLoggedIn } = this.state;
        if (!isLoggedIn) {
            return <Redirect to="/" />;
        }
        return (
            <header>
                <ul>
                    <li>
                        <a href="/profile">Profile</a>
                    </li>
                    <li>
                        <a className="active" href="/content">
                            Content
                        </a>
                    </li>
                </ul>
            </header>
        );
    }
}

export default Header;
