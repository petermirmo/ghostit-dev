import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import Page from "../../components/containers/Page";
import GIContainer from "../../components/containers/GIContainer";

import GIText from "../../components/views/GIText";
import GIButton from "../../components/views/GIButton";
import GIInput from "../../components/views/GIInput";

import Consumer from "../../context";

import { sendResetEmail } from "./util";

class ForgotPasswordPage extends Component {
  state = {
    email: ""
  };

  componentDidMount() {
    if (this.props.user) this.props.history.push("/home");
  }
  handleChange = (index, value) => {
    this.setState({ [index]: value });
  };

  render() {
    const { email } = this.state;

    return (
      <Consumer>
        {context => (
          <Page
            className="login-background website-page align-center pt32"
            keywords="content, ghostit, marketing"
            title="Forgot Password"
          >
            <GIContainer className="column x-fill full-center pb64">
              <GIText className="tac mb16" text="Password" type="h2">
                <GIText className="four-blue" text="Forgot&nbsp;" type="span" />
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
                  <GIButton
                    className="bg-blue-fade white py8 px16 br4"
                    onClick={() =>
                      sendResetEmail(email, notification =>
                        context.notify(notification)
                      )
                    }
                    text="Send Password Reset"
                  />

                  <Link to="/sign-in">
                    <GIContainer className="full-center mt8">
                      <GIText text="Back to" type="h6" />
                      <GIButton
                        className="underline-button ml4"
                        text="Sign In"
                      />
                    </GIContainer>
                  </Link>
                </form>
              </GIContainer>{" "}
            </GIContainer>
          </Page>
        )}
      </Consumer>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default withRouter(connect(mapStateToProps)(ForgotPasswordPage));
