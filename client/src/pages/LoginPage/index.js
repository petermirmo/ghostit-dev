import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  changePage,
  setUser,
  updateAccounts,
  openHeaderSideBar
} from "../../redux/actions/";
import logo from "./logo.png";
import Notification from "../../components/Notifications/Notification/";
import "./styles/";

let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class Login extends Component {
  state = {
    login: "login",
    fullName: "",
    email: "",
    website: "",
    timezone: timezone ? timezone : "America/Vancouver",
    password: "",
    notification: {
      on: false,
      title: "Something went wrong!",
      message: "",
      type: "danger"
    }
  };

  handleChange = (index, value) => {
    this.setState({ [index]: value });
  };
  notify = notificationObject => {
    let { notification } = this.state;
    let { message, title, type } = notificationObject;
    notification.on = !notification.on;
    if (message) notification.message = message;
    if (title) notification.title = title;
    if (type) notification.type = type;

    this.setState({ notification: notification });

    if (notification.on) {
      setTimeout(() => {
        let { notification } = this.state;
        notification.on = false;
        this.setState({ notification: notification });
      }, 5000);
    }
  };
  login = event => {
    event.preventDefault();
    const { email, password } = this.state;

    if (email && password) {
      axios.post("/api/login", { email, password }).then(res => {
        const { success, user, message } = res.data;

        if (success) {
          // Get all connected accounts of the user
          axios.get("/api/accounts").then(res => {
            let { accounts } = res.data;
            if (!accounts) accounts = [];
            this.props.setUser(user);
            this.props.updateAccounts(accounts);

            if (user.role === "demo") this.props.changePage("subscribe");
            else this.props.changePage("content");

            this.props.openHeaderSideBar(true);
          });
        } else {
          this.notify({
            message,
            type: "danger",
            title: "Something went wrong!"
          });
        }
      });
    }
  };
  register = event => {
    event.preventDefault();
    const { fullName, email, website, timezone, password } = this.state;

    if (fullName && email && website && timezone && password) {
      axios
        .post("/api/register", {
          fullName: fullName,
          email: email,
          website: website,
          timezone: timezone,
          password: password
        })
        .then(res => {
          const { success, user, message } = res.data;

          if (success) {
            this.props.updateAccounts([]);
            this.props.setUser(user);
            this.props.changePage("content");
            this.props.openHeaderSideBar(true);
          } else {
            this.notify({
              message: message,
              type: "danger",
              title: "Something went wrong!"
            });
          }
        });
    }
  };
  sendResetEmail = () => {
    const { email } = this.state;
    if (!email) {
      this.notify({
        message: "Please enter an email address!",
        type: "danger",
        title: "Something went wrong!"
      });
      return;
    } else {
      axios.post("/api/email/reset", { email: email }).then(res => {
        let { success, errorMessage } = res.data;
        if (success) {
          this.notify({ message: " ", type: "success", title: "Email Sent!" });
        } else {
          this.notify({
            message: errorMessage,
            type: "danger",
            title: "Error!"
          });
        }
      });
    }
  };
  render() {
    const {
      login,
      fullName,
      email,
      website,
      password,
      notification
    } = this.state;

    return (
      <div className="login-background">
        <img src={logo} alt="logo" />

        <div className="login-box">
          {login === "login" && (
            <div>
              <form className="form-box" action="/api/auth/login" method="post">
                <input
                  className="login-input"
                  value={email}
                  onChange={event =>
                    this.handleChange("email", event.target.value)
                  }
                  type="text"
                  name="email"
                  placeholder="Email"
                  required
                />
                <input
                  className="login-input password"
                  value={password}
                  onChange={event =>
                    this.handleChange("password", event.target.value)
                  }
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                />
                <button
                  className="submit-colorful"
                  onClick={this.login}
                  type="submit"
                >
                  Sign In
                </button>
              </form>

              <br />
              <div
                className="login-switch center"
                href="#"
                onClick={event => this.handleChange("login", "register")}
              >
                New to Ghostit?{" "}
                <h4 className="login-switch-highlight"> Sign Up</h4>
              </div>
            </div>
          )}
          {login === "register" && (
            <div>
              <form className="form-box" action="api/user" method="post">
                <input
                  className="login-input"
                  value={fullName}
                  onChange={event =>
                    this.handleChange("fullName", event.target.value)
                  }
                  type="text"
                  name="fullName"
                  placeholder="Company Name"
                  required
                />

                <input
                  className="login-input"
                  value={email}
                  onChange={event =>
                    this.handleChange("email", event.target.value)
                  }
                  type="text"
                  name="email"
                  placeholder="Email"
                  required
                />

                <input
                  className="login-input"
                  value={website}
                  onChange={event =>
                    this.handleChange("website", event.target.value)
                  }
                  type="text"
                  name="website"
                  placeholder="Website"
                  required
                />

                <input
                  className="login-input password"
                  value={password}
                  onChange={event =>
                    this.handleChange("password", event.target.value)
                  }
                  name="password"
                  placeholder="Password"
                  required
                />

                <button
                  className="submit-colorful"
                  onClick={this.register}
                  type="submit"
                >
                  Register
                </button>
              </form>

              <br />
              <div
                className="login-switch center"
                href="#"
                onClick={event => this.handleChange("login", "login")}
              >
                Have an account?{" "}
                <h4 className="login-switch-highlight"> Sign In</h4>
              </div>
            </div>
          )}
          {login === "forgotPassword" && (
            <div>
              <input
                className="login-input"
                value={email}
                onChange={event =>
                  this.handleChange("email", event.target.value)
                }
                type="text"
                name="email"
                placeholder="Email"
                required
              />
              <button className="submit-blue" onClick={this.sendResetEmail}>
                Send Password Reset
              </button>
              <div
                className="login-switch center"
                href="#"
                onClick={event => this.handleChange("login", "login")}
              >
                Back to <h4 className="login-switch-highlight"> Sign In</h4>
              </div>
            </div>
          )}
        </div>
        {login !== "forgotPassword" && (
          <p
            className="forgot-password center"
            onClick={event => this.handleChange("login", "forgotPassword")}
          >
            Forgot password?
          </p>
        )}
        {notification.on && (
          <Notification
            title={notification.title}
            message={notification.message}
            type={notification.type}
            callback={this.notify}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { activePage: state.activePage };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changePage: changePage,
      setUser: setUser,
      updateAccounts: updateAccounts,
      openHeaderSideBar: openHeaderSideBar
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
