import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";
import Notification from "../../components/notifications/Notification/";

import GIText from "../../components/views/GIText";
import GIButton from "../../components/views/GIButton";
import GIInput from "../../components/views/GIInput";

import { sendResetEmail } from "./util";

class ForgotPasswordPage extends Component {
  state = {
    email: "",
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

  render() {
    const { email, notification } = this.state;

    return (
      <Page
        className="login-background website-page align-center"
        keywords="content, ghostit, marketing"
        title="Forgot Password"
      >
        <GIText className="pb16 tac" text="Forgot Password" type="h1" />

        <GIContainer className="basic-box common-shadow pa32 br16 margin-hc">
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
            <GIButton
              className="regular-button mb8"
              onClick={() => sendResetEmail(email, this.handleChange)}
              text="Send Password Reset"
            />

            <Link to="/sign-in">
              <GIContainer className="full-center">
                <GIText text="Back to" type="h6" />
                <GIButton className="underline-button ml4" text="Sign In" />
              </GIContainer>
            </Link>
          </form>
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
export default withRouter(connect(mapStateToProps)(ForgotPasswordPage));
