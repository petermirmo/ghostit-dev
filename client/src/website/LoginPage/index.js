import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  setUser,
  updateAccounts,
  openHeaderSideBar,
  setTutorial
} from "../../redux/actions/";

import Notification from "../../components/Notifications/Notification/";
import "./style.css";

let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = this.createState(props);
    window.onkeyup = e => {
      let key = e.keyCode ? e.keyCode : e.which;

      if (key == 13) {
        const { login } = this.state;
        if (login === "login") this.login(e);
        else if (login === "register") this.register(e);
      }
    };
  }
  componentDidMount() {
    if (this.props.user) this.props.history.push("/content");
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.createState(nextProps));
  }
  createState = props => {
    return {
      login: props.signUp ? "register" : "login",
      fullName: "",
      email: "",
      website: "",
      timezone: timezone ? timezone : "America/Vancouver",
      password: "",
      passwordConfirm: "",
      notification: {
        on: false,
        title: "Something went wrong!",
        message: "",
        type: "danger"
      }
    };
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
      axios
        .post("/api/login", { email: email.toLowerCase(), password })
        .then(res => {
          const { success, user, message } = res.data;

          if (success) {
            // Get all connected accounts of the user
            axios.get("/api/accounts").then(res => {
              let { accounts } = res.data;
              if (!accounts) accounts = [];

              if (user.role === "demo")
                this.activateDemoUserLogin(user, accounts);
              else {
                this.props.history.push("/content");
                this.props.setUser(user);
                this.props.updateAccounts(accounts);
              }
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
    const {
      fullName,
      email,
      website,
      timezone,
      password,
      passwordConfirm
    } = this.state;

    if (fullName && email && website && timezone && password) {
      if (password !== passwordConfirm) {
        alert("Passwords do not match.");
        return;
      }
      axios
        .post("/api/register", {
          fullName,
          email: email.toLowerCase(),
          website,
          timezone,
          password
        })
        .then(res => {
          const { success, user, message } = res.data;

          if (success && user) this.activateDemoUserLogin(user, []);
          else {
            this.notify({
              message,
              type: "danger",
              title: "Wrong email!"
            });
          }
        });
    } else {
      if (!fullName || !email || !website || !password) {
        alert("Please make sure each text field is filled in.");
      } else if (!timezone) {
        alert(
          "Error with timezone. Reload page and try again. If error persists, please contact Ghostit."
        );
      }
    }
  };
  activateDemoUserLogin = (user, accounts) => {
    this.props.history.push("/subscribe");
    this.props.setUser(user);
    this.props.updateAccounts(accounts);

    this.props.openHeaderSideBar(true);
    let temp = { ...this.props.tutorial };
    temp.on = true;
    let somethingChanged = false;
    for (let index in temp)
      if (temp[index] != this.props.tutorial[index]) somethingChanged = true;

    if (somethingChanged) {
      this.props.setTutorial(temp);
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
      axios
        .post("/api/email/reset", { email: email.toLowerCase() })
        .then(res => {
          let { success, errorMessage } = res.data;
          if (success) {
            this.notify({
              message: " ",
              type: "success",
              title: "Email Sent!"
            });
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
      notification,
      passwordConfirm
    } = this.state;

    return (
      <div className="login-background flex column vc">
        <h1 className="silly-font pb16">
          {login === "login" ? "Sign in to Ghostit!" : "Sign up for Ghostit!"}
        </h1>

        <div className="login-box pa32 br16 flex column">
          {login === "login" && (
            <div>
              <div className="form-box flex column vc">
                <input
                  className="login-input pa8 mb8 br4"
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
                  className="login-input pa8 mb8 br4"
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
                  className="submit-blue common-transition px32 py8 my8 br4 button flex hc"
                  onClick={this.login}
                  type="submit"
                >
                  Sign In
                </div>
              </div>
              <p className="login-switch mt8 button flex vc hc">
                New to Ghostit?
                <Link to="/sign-up">
                  <button className="login-switch-highlight ml4">
                    {" "}
                    Sign Up
                  </button>
                </Link>
              </p>
            </div>
          )}
          {login === "register" && (
            <div>
              <div className="form-box flex column vc">
                <input
                  className="login-input pa8 mb8 br4"
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
                  className="login-input pa8 mb8 br4"
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
                  className="login-input pa8 mb8 br4"
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
                  className="login-input pa8 mb8 br4"
                  value={password}
                  onChange={event =>
                    this.handleChange("password", event.target.value)
                  }
                  name="password"
                  placeholder="Password"
                  type="password"
                  required
                />

                <input
                  className="login-input pa8 mb8 br4"
                  value={passwordConfirm}
                  onChange={event =>
                    this.handleChange("passwordConfirm", event.target.value)
                  }
                  name="passwordConfirm"
                  placeholder="Confirm Password"
                  type="password"
                  required
                />

                <div
                  className="submit-blue common-transition px32 py8 my8 br4 button flex hc"
                  onClick={this.register}
                  type="submit"
                >
                  Register
                </div>
              </div>
              <p className="login-switch mt8 button flex vc hc">
                Have an account?
                <Link to="/sign-in">
                  <button className="login-switch-highlight ml4">
                    {" "}
                    Sign In
                  </button>
                </Link>
              </p>
            </div>
          )}
          {login === "forgotPassword" && (
            <div>
              <input
                className="login-input pa8 mb8 br4"
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
                className="submit-blue common-transition pa8 mb8 br4 button"
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
  return {
    tutorial: state.tutorial,
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
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
