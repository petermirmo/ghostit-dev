import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  changePage,
  setUser,
  updateAccounts,
  openHeaderSideBar,
  setTutorial
} from "../../redux/actions/";
import logo from "./logo.png";
import Notification from "../../components/Notifications/Notification/";
import "./styles/";

let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: props.signUp ? "register" : "login",
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
  }

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

    this.setState({ notification });

    if (notification.on) {
      setTimeout(() => {
        let { notification } = this.state;
        notification.on = false;
        this.setState({ notification });
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

            if (user.role === "demo") {
              this.props.changePage("subscribe");
              let temp = this.props.tutorial;
              temp.on = true;
              this.props.setTutorial(temp);
            } else this.props.changePage("content");
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
          fullName,
          email,
          website,
          timezone,
          password
        })
        .then(res => {
          const { success, user, message } = res.data;

          if (success) {
            this.props.updateAccounts([]);
            this.props.setUser(user);
            this.props.changePage("subscribe");
            this.props.openHeaderSideBar(true);
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
      axios.post("/api/email/reset", { email }).then(res => {
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
      <div className="login-background flex column vc">
        <img src={logo} alt="logo" className="py32" />

        <div className="login-box pa32 round16 flex column">
          {login === "login" && (
            <div>
              <div className="form-box flex column vc">
                <input
                  className="login-input pa8 mb8 round4"
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
                  className="login-input pa8 mb8 round4"
                  value={password}
                  onChange={event =>
                    this.handleChange("password", event.target.value)
                  }
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                />
                <div
                  className="submit-blue common-transition px32 py8 my8 round4 button flex hc"
                  onClick={this.login}
                  type="submit"
                >
                  Sign In
                </div>
              </div>

              <div
                className="login-switch mt8 button flex vc hc"
                onClick={event => this.handleChange("login", "register")}
              >
                New to Ghostit?{" "}
                <div className="login-switch-highlight ml4">Sign Up</div>
              </div>
            </div>
          )}
          {login === "register" && (
            <div>
              <div className="form-box flex column vc">
                <input
                  className="login-input pa8 mb8 round4"
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
                  className="login-input pa8 mb8 round4"
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
                  className="login-input pa8 mb8 round4"
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
                  className="login-input pa8 mb8 round4 password"
                  value={password}
                  onChange={event =>
                    this.handleChange("password", event.target.value)
                  }
                  name="password"
                  placeholder="Password"
                  required
                />

                <div
                  className="submit-blue common-transition px32 py8 my8 round4 button flex hc"
                  onClick={this.register}
                  type="submit"
                >
                  Register
                </div>
              </div>

              <div
                className="login-switch mt8 button flex vc hc"
                onClick={event => this.handleChange("login", "login")}
              >
                Have an account?{" "}
                <div className="login-switch-highlight ml4"> Sign In</div>
              </div>
            </div>
          )}
          {login === "forgotPassword" && (
            <div>
              <input
                className="login-input pa8 mb8 round4"
                value={email}
                onChange={event =>
                  this.handleChange("email", event.target.value)
                }
                type="text"
                name="email"
                placeholder="Email"
                required
              />
              <button
                className="submit-blue common-transition pa8 mb8 round4 button"
                onClick={this.sendResetEmail}
              >
                Send Password Reset
              </button>
              <div
                className="login-switch mt8 button flex vc hc"
                onClick={event => this.handleChange("login", "login")}
              >
                Back to{" "}
                <div className="login-switch-highlight ml4">Sign In</div>
              </div>
            </div>
          )}
        </div>
        {login !== "forgotPassword" && (
          <div
            className="forgot-password button mt16"
            onClick={event => this.handleChange("login", "forgotPassword")}
          >
            Forgot password?
          </div>
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
  return { activePage: state.activePage, tutorial: state.tutorial };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changePage,
      setUser,
      updateAccounts,
      openHeaderSideBar,
      setTutorial
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
