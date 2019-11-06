import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import axios from "axios";
import ReactGA from "react-ga";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { setUser, setAccounts } from "../../redux/actions/";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import GIText from "../../components/views/GIText";
import GIButton from "../../components/views/GIButton";
import GIInput from "../../components/views/GIInput";
import Consumer, { ExtraContext } from "../../context";

import { getCalendars } from "../../pages/util";
import {
  getCalendarAccounts,
  getCalendarUsers
} from "../../pages/Calendar/util";

class LoginPage extends Component {
  state = {
    email: "",
    password: ""
  };
  componentDidMount() {
    if (this.props.user) this.props.history.push("/dashboard");
  }

  handleChange = (index, value) => {
    this.setState({ [index]: value });
  };

  activateDemoUserLogin = (accounts, context, user) => {
    if (process.env.NODE_ENV !== "development")
      ReactGA.event({
        category: "User",
        action: "Register"
      });
    this.loginFinal(accounts, context, user);
  };
  loginFinal = (accounts, context, user) => {
    context.handleChange({ user });

    getCalendars(stateObject => {
      context.handleChange(stateObject, () => {
        getCalendarAccounts(
          stateObject.activeCalendarIndex,
          stateObject.calendars,
          context.handleCalendarChange
        );
        getCalendarUsers(
          stateObject.activeCalendarIndex,
          stateObject.calendars,
          context.handleCalendarChange
        );
      });
    });

    this.props.setUser(user);
    this.props.setAccounts(accounts);
    this.props.history.push("/dashboard");
  };
  login = (event, context) => {
    event.preventDefault();
    const { email, password } = this.state;

    if (email && password) {
      axios
        .post("/api/login", { email: email.toLowerCase(), password })
        .then(res => {
          const { message, success, user } = res.data;

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
                this.activateDemoUserLogin(accounts, context, user);
              else {
                this.loginFinal(accounts, context, user);
              }
            });
          } else {
            context.notify({
              message,
              type: "danger",
              title: "Something went wrong!"
            });
          }
        });
    }
  };

  render() {
    const { email, password } = this.state;

    return (
      <Consumer>
        {context => (
          <Page
            className="login-background website-page align-center pt32"
            description="Ghostit sign in :)"
            keywords="content, ghostit, marketing"
            title="Sign In"
          >
            <GIContainer className="column x-fill full-center pb64">
              <GIText className="tac mb16" text="Sign In!" type="h2">
                <GIText
                  className="four-blue"
                  text="Ghostit&nbsp;"
                  type="span"
                />
              </GIText>

              <GIContainer className="container-box large bg-white shadow pa32 br16">
                <form
                  className="common-container"
                  onSubmit={event => event.preventDefault()}
                >
                  <GIInput
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
                    className="bg-blue-fade white py8 px16 br4"
                    onClick={event => this.login(event, context)}
                    text="Sign In"
                  />
                  <Link to="/sign-up">
                    <GIContainer className="full-center mt8">
                      <GIText text="New to Ghostit?" type="h6" />

                      <GIButton
                        className="underline-button ml4"
                        text="Sign Up"
                      />
                    </GIContainer>
                  </Link>
                </form>
              </GIContainer>

              <GIContainer className="full-center mt16">
                <Link to="/forgot-password">
                  <GIButton
                    className="underline-button"
                    text="Forgot password?"
                  />
                </Link>
              </GIContainer>
            </GIContainer>
          </Page>
        )}
      </Consumer>
    );
  }
}
LoginPage.contextType = ExtraContext;

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUser,
      setAccounts
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
