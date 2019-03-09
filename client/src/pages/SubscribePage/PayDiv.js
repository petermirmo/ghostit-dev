import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser, changePage } from "../../redux/actions/";

import Notification from "../../components/notifications/Notification/";
import Loader from "../../components/notifications/Loader/";

//pk_test_C6VKqentibktzCQjTRZ9vOuY
//pk_live_fbteh655nQqpE4WEFr6fs5Pm
class ChargeCardForm extends Component {
  state = {
    saving: false,
    notification: {
      on: false,
      title: "",
      message: "",
      type: "danger"
    },
    onboardingModal: false
  };
  componentDidMount() {
    var stripe = window.Stripe("pk_live_fbteh655nQqpE4WEFr6fs5Pm");

    // Create an instance of Elements.
    var elements = stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "20px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };
    // Create an instance of the card Element.
    var card = elements.create("card", { style: style });

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount("#card-element");

    // Handle real-time validation errors from the card Element.
    card.addEventListener("change", event => {
      var displayError = document.getElementById("card-errors");
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = "";
      }
    });

    // Create a token or display an error when the form is submitted.
    var form = document.getElementById("payment-form");
    form.addEventListener("submit", event => {
      event.preventDefault();

      stripe.createToken(card).then(result => {
        if (result.error) {
          // Inform the customer that there was an error.
          var errorElement = document.getElementById("card-errors");
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to your server.
          this.stripeTokenHandler(result.token);
        }
      });
    });
  }

  notify = (message, type, title) => {
    let { notification } = this.state;
    notification.on = !notification.on;
    if (message) notification.message = message;
    if (type) notification.type = type;
    if (title) notification.title = title;

    this.setState({ notification: notification });

    if (notification.on) {
      setTimeout(() => {
        let { notification } = this.state;
        notification.on = false;
        this.setState({ notification: notification });
      }, 5000);
    }
  };

  stripeTokenHandler = stripeToken => {
    this.setState({ saving: true });
    if (stripeToken) {
      axios
        .post("/api/planPro", {
          stripeToken,
          annualBilling: this.props.annualBilling
        })
        .then(res => {
          this.setState({ saving: false });

          const { success, message, user, loggedIn } = res.data;
          if (loggedIn === false) this.props.history.push("/sign-in");

          if (success) {
            if (user) {
              if (
                this.props.user.role !== "admin" &&
                this.props.user.role !== "manager"
              ) {
                this.props.setUser(user);
                this.props.changePage("content");
              }
            }
          } else {
            this.notify(message, "danger", "Something went wrong!");
          }
        });
    } else {
      this.notify("Invalid credit card data", "danger");
    }
  };

  render() {
    const { notification, saving } = this.state;
    const { user } = this.props;

    return (
      <div className="pay-container">
        {saving && <Loader />}
        {notification.on && (
          <Notification
            title={notification.title}
            message={notification.message}
            type={notification.type}
            callback={this.notify}
          />
        )}
        <form action="/api/planPro" method="post" id="payment-form">
          <div className="form-row">
            <div id="card-element" />

            <div id="card-errors" role="alert" />
          </div>

          {!saving && (user.role === "demo" || user.role === "admin") && (
            <button className="sign-up common-transition mt16 pa8 round">
              Submit Payment
            </button>
          )}
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setUser, changePage }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChargeCardForm);
