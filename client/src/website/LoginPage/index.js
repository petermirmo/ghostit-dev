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

import GIText from "../../components/views/GIText";
import GIButton from "../../components/views/GIButton";
import GIInput from "../../components/views/GIInput";

import "./style.css";

class LoginPage extends Component {
  state = {
    email: "",
    password: "",
    notification: {
      on: false,
      title: "Something went wrong!",
      message: "",
      type: "danger"
    }
  };

  componentDidMount() {
    if (this.props.user) this.props.history.push("/home");
  }
  handleChange = (index, value) => {
    this.setState({ [index]: value });
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
  login = event => {
    event.preventDefault();
    const { email, password } = this.state;

    if (email && password) {
      axios
        .post("/api/login", { email: email.toLowerCase(), password })
        .then(res => {
          const { error, user } = res.data;

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

  render() {
    const { email, password, notification } = this.state;

    return (
      <Page
        className="login-background simple-container website-page"
        title="Sign In"
        description="Ghostit sign in :)"
        keywords="content, ghostit, marketing"
      >
        <GIText className="pb16 tac" text="Sign in to Ghostit!" type="h1" />

        <div className="basic-box common-shadow pa32 br16 margin-hc">
          <form className="common-container">
            <input
              className="regular-input mb8"
              value={email}
              onChange={event => this.handleChange("email", event.target.value)}
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
          </form>
        </div>
        <GIContainer className="full-center mt16">
          <GIContainer
            style={{ backgroundColor: "var(--white-theme-color)" }}
            className="pa8 br4"
          >
            <Link to="/forgot-password">
              <button className="very-important-text">Forgot password?</button>
            </Link>
          </GIContainer>
        </GIContainer>
        {notification.on && (
          <Notification
            notification={notification}
            callback={notification => this.setState({ notification })}
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
  )(LoginPage)
);
