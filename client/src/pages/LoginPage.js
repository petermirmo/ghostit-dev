import React, { Component } from "react";
import "../css/theme.css";

function changeToRegistrationForm() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "";
}
function changeToLoginForm() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "";
}

class Login extends Component {
    render() {
        return (
            <div className="login-background">
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
                            />
                            <input
                                className="submit-colorful"
                                value="Sign In"
                                type="submit"
                            />
                        </form>

                        <br />
                        <p
                            id="registerButton"
                            href="#"
                            onClick={changeToRegistrationForm}
                            style={{ cursor: "pointer" }}
                        >
                            Dont have an account? Get started here!
                        </p>
                    </div>

                    <div id="registerForm" style={{ display: "none" }}>
                        <form
                            className="form-box"
                            action="api/auth/email/register"
                            method="post"
                        >
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
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
                            />
                            <hr
                                style={{
                                    border: "2px solid #eeeeef",
                                    width: "90%"
                                }}
                            />

                            <input
                                className="submit-colorful"
                                type="submit"
                                value="Register"
                            />
                        </form>

                        <br />
                        <p
                            id="registerButton"
                            href="#"
                            onClick={changeToLoginForm}
                            style={{ cursor: "pointer" }}
                        >
                            Have an account? Sign in!
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
