import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { changePage, setUser } from "../../redux/actions/";
import OnboardingModal from "../../components/Onboarding/OnboardingModal/";
import Notification from "../../components/Notifications/Notification/";
import Loader from "../../components/Notifications/Loader/";

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
					this.stripeTokenHandler(result.token, this.props.plan);
				}
			});
		});
	}

	closeOnboardingModal = () => {
		this.setState({ onboardingModal: false });
	};
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

	stripeTokenHandler = (stripeToken, plan) => {
		this.setState({ saving: true });
		if (stripeToken) {
			axios.post("/api/signUpToPlan", { stripeToken: stripeToken, plan: plan }).then(res => {
				this.setState({ saving: false });

				const { success, message, user } = res.data;

				if (success) {
					if (user) {
						this.props.setUser(user);
					}

					this.setState({ onboardingModal: true });
				} else {
					this.notify(message, "danger", "Something went wrong!");
				}
			});
		} else {
			this.notify("Invalid credit card data", "danger");
		}
	};

	render() {
		const { notification, saving, onboardingModal } = this.state;
		const { user } = this.props;

		return (
			<div>
				{saving && <Loader />}
				{notification.on && (
					<Notification
						title={notification.title}
						message={notification.message}
						notificationType={notification.type}
						callback={this.notify}
					/>
				)}
				<form action="/api/signUpToPlan" method="post" id="payment-form">
					<div className="form-row">
						<div id="card-element" />

						<div id="card-errors" role="alert" />
					</div>

					{!saving &&
						(user.role === "demo" || user.role === "admin") && (
							<button className="sign-up center">Submit Payment</button>
						)}
				</form>
				{onboardingModal && <OnboardingModal close={this.closeOnboardingModal} />}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { activePage: state.activePage, user: state.user };
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({ changePage: changePage, setUser: setUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChargeCardForm);
