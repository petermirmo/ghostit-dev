import React, { Component } from "react";
import axios from "axios";

var plan;
class ChargeCardForm extends Component {
	constructor(props) {
		super(props);
		plan = this.props.plan;
	}
	componentWillReceiveProps(nextProps) {
		plan = nextProps.plan;
	}
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
		card.addEventListener("change", function(event) {
			var displayError = document.getElementById("card-errors");
			if (event.error) {
				displayError.textContent = event.error.message;
			} else {
				displayError.textContent = "";
			}
		});

		// Create a token or display an error when the form is submitted.
		var form = document.getElementById("payment-form");
		form.addEventListener("submit", function(event) {
			event.preventDefault();

			stripe.createToken(card).then(function(result) {
				if (result.error) {
					// Inform the customer that there was an error.
					var errorElement = document.getElementById("card-errors");
					errorElement.textContent = result.error.message;
				} else {
					// Send the token to your server.
					stripeTokenHandler(result.token, plan);
				}
			});
		});
	}

	render() {
		return (
			<form action="/api/signUpToPlan" method="post" id="payment-form">
				<div className="form-row">
					<div id="card-element" />

					<div id="card-errors" role="alert" />
				</div>

				<button className="sign-up center">Submit Payment</button>
			</form>
		);
	}
}
function stripeTokenHandler(stripeToken, plan) {
	axios.post("/api/signUpToPlan", { stripeToken: stripeToken, plan: plan }).then(res => {
		console.log(res);
	});
}
export default ChargeCardForm;
