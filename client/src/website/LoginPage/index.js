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
          const { success, user } = res.data;

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
        title="Sign In"
        description="Ghostit sign in :)"
        keywords="content, ghostit, marketing"
        className="login-background website-page align-center"
      >
        <GIText className="pb16 tac" text="Sign in to Ghostit!" type="h1" />

        <GIContainer className="basic-box common-shadow pa32 br16">
          <form
            className="common-container"
            onSubmit={event => event.preventDefault()}
          >
            <GIInput
              className="regular-input mb8"
              value={email}
              onChange={event => this.handleChange("email", event.target.value)}
              type="text"
              name="email"
              placeholder="Email"
              required
            />
            <GIInput
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
            <GIButton
              className="regular-button mb8"
              onClick={this.login}
              text="Sign In"
            />
            <Link to="/sign-up">
              <GIContainer className="full-center">
                <GIText text="New to Ghostit?" type="h6" />

                <GIButton className="underline-button ml4" text="Sign Up" />
              </GIContainer>
            </Link>
          </form>
        </GIContainer>

        <GIContainer className="full-center mt16">
          <Link to="/forgot-password">
            <GIButton
              className="underline-button white"
              text="Forgot password?"
            />
          </Link>
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
