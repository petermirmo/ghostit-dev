import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import axios from "axios";
import ReactGA from "react-ga";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { setUser, setaccounts } from "../../redux/actions/";

import { validateEmail } from "../../componentFunctions";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import Notification from "../../components/notifications/Notification/";

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
    if (this.props.user) this.props.history.push("/home");
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
            ReactGA.event({
              category: "User",
              action: "Login"
            });
            // Get all connected accounts of the user
            axios.get("/api/accounts").then(res => {
              let { accounts } = res.data;
              if (!accounts) accounts = [];

              if (user.role === "demo")
                this.activateDemoUserLogin(user, accounts);
              else {
                this.props.setUser(user);
                this.props.setaccounts(accounts);
                this.props.history.push("/content");
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

    if (!validateEmail(email)) {
      alert("Not a real email address!");
      return;
    }

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
              title: "Error"
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
    ReactGA.event({
      category: "User",
      action: "Register"
    });
    this.props.setUser(user);
    this.props.setaccounts(accounts);
    this.props.history.push("/subscribe");
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
      <Page
        className="login-background simple-container website-page"
        title={login === "login" ? "Sign In" : "Sign Up"}
        description={
          login === "login"
            ? "Ghostit sign in :)"
            : "What are you waiting for!? Sign up today!"
        }
        keywords="content, ghostit, marketing"
      >
        <h1 className="pb16 tac">
          {login === "login" ? "Sign in to Ghostit!" : "Sign up for Ghostit!"}
        </h1>

        <div className="basic-box common-shadow pa32 br16 margin-hc">
          {login === "login" && (
            <div className="common-container">
              <input
                className="regular-input mb8"
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
                className="regular-input mb8"
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
                className="regular-button mb8"
                onClick={this.login}
                type="submit"
              >
                Sign In
              </button>
              <h4 className="unimportant-text button tac">
                New to Ghostit?
                <Link to="/sign-up">
                  <button className="very-important-text ml4">Sign Up</button>
                </Link>
              </h4>
            </div>
          )}
          {login === "register" && (
            <div className="common-container">
              <input
                className="regular-input mb8"
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
                className="regular-input mb8"
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
                className="regular-input mb8"
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
                className="regular-input mb8"
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
                className="regular-input mb8"
                value={passwordConfirm}
                onChange={event =>
                  this.handleChange("passwordConfirm", event.target.value)
                }
                name="passwordConfirm"
                placeholder="Confirm Password"
                type="password"
                required
              />

              <button
                className="regular-button mb8"
                onClick={this.register}
                type="submit"
              >
                Register
              </button>
              <h4 className="unimportant-text button tac">
                Have an account?
                <Link to="/sign-in">
                  <button className="very-important-text ml4">Sign In</button>
                </Link>
              </h4>
            </div>
          )}
          {login === "forgotPassword" && (
            <div className="common-container">
              <input
                className="regular-input mb8"
                value={email}
                onChange={event =>
                  this.handleChange("email", event.target.value)
                }
                type="text"
                name="email"
                placeholder="Email"
                required
              />
              <button className="regular-button" onClick={this.sendResetEmail}>
                Send Password Reset
              </button>
              <div
                className="login-switch mt8 button flex vc hc"
                onClick={event => this.handleChange("login", "login")}
              >
                Back to <div className="very-important-text ml4">Sign In</div>
              </div>
            </div>
          )}
        </div>
        {login !== "forgotPassword" && (
          <GIContainer className="full-center mt16">
            <GIContainer
              style={{ backgroundColor: "var(--white-theme-color)" }}
              className="pa8 br4"
            >
              <button
                className="very-important-text"
                onClick={event => this.handleChange("login", "forgotPassword")}
              >
                Forgot password?
              </button>
            </GIContainer>
          </GIContainer>
        )}
        {notification.on && (
          <Notification
            title={notification.title}
            message={notification.message}
            type={notification.type}
            callback={this.notify}
          />
        )}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUser,
      setaccounts
    },
    dispatch
  );
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
