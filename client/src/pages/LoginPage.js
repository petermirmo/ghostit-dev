import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "../css/theme.css";

import langingPageBackground from "./langing_page.jpeg";
import logo from "./logo.png";

// User's timezone
var userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function changeToRegistrationForm() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "";
}
function changeToLoginForm() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "";
}

class Login extends Component {
    state = {
        isLoggedIn: false
    };
    constructor(props) {
        super(props);
        axios
            .get("/api/isUserSignedIn")
            .then(res => this.setState({ isLoggedIn: res.data }));
    }
    render() {
        const { isLoggedIn } = this.state;
        if (isLoggedIn) {
            return <Redirect to="/content" />;
        }
        return (
            <div>
                <div className="landing-page">
                    <img
                        src={langingPageBackground}
                        alt="Landing Page"
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute"
                        }}
                    />
                    <div className="container">
                        <h1>Find Out How We Can Get You Even More Traffic</h1>
                        <h5>
                            Have you talked to anyone at Ghostit about our
                            newest addition to our offering? We are currently
                            building out our very own ads platform that will
                            allow you to take your target audience and make your
                            content even more powerful.
                        </h5>
                        <button>Talk to us to get this feature!</button>
                    </div>
                </div>
                <div className="login-background">
                    <img src={logo} alt="logo" />
                    <div className="login-box">
                        <div id="loginForm">
                            <form
                                className="form-box"
                                action="/api/auth/login"
                                method="post"
                            >
                                <input
                                    id="emailLoginInput"
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    style={{ marginTop: "5px" }}
                                    required
                                />
                                <hr
                                    style={{
                                        border: "2px solid #eeeeef",
                                        width: "90%"
                                    }}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                />
                                <hr
                                    style={{
                                        border: "2px solid #eeeeef",
                                        width: "90%"
                                    }}
                                />
                                <input
                                    className="submit-colorful"
                                    value="Sign In"
                                    type="submit"
                                    style={{ marginBottom: "5px" }}
                                />
                            </form>

                            <br />
                            <p
                                id="registerButton"
                                className="login-switch"
                                href="#"
                                onClick={changeToRegistrationForm}
                                style={{ width: "70%" }}
                            >
                                Dont have an account? Get started here!
                            </p>
                        </div>

                        <div
                            id="registerForm"
                            style={{ display: "none", textAlign: "center" }}
                        >
                            <form
                                className="form-box"
                                action="api/auth/email/register"
                                method="post"
                            >
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    style={{ marginTop: "5px" }}
                                    required
                                />
                                <hr
                                    style={{
                                        border: "2px solid #eeeeef",
                                        width: "90%"
                                    }}
                                />
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    required
                                />
                                <hr
                                    style={{
                                        border: "2px solid #eeeeef",
                                        width: "90%"
                                    }}
                                />
                                <input
                                    type="text"
                                    name="website"
                                    placeholder="Website"
                                    required
                                />
                                <hr
                                    style={{
                                        border: "2px solid #eeeeef",
                                        width: "90%"
                                    }}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                />
                                <hr
                                    style={{
                                        border: "2px solid #eeeeef",
                                        width: "90%"
                                    }}
                                />
                                <input
                                    name="timezone"
                                    placeholder="Timezone"
                                    value={userTimezone}
                                    style={{ display: "none" }}
                                    readOnly="true"
                                />
                                <input
                                    className="submit-colorful"
                                    type="submit"
                                    value="Register"
                                    style={{ marginBottom: "5px" }}
                                />
                            </form>

                            <br />
                            <p
                                id="registerButton"
                                className="login-switch"
                                href="#"
                                onClick={changeToLoginForm}
                                style={{ width: "50%" }}
                            >
                                Have an account? Sign in!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
