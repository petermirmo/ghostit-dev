import React, { Component } from "react";

class PayDiv extends Component {
	render() {
		return (
			<form action="/charge" method="post" id="payment-form">
				<div className="form-row">
					<label htmlFor="card-element">Credit or debit card</label>
					<div id="card-element" />

					<div id="card-errors" role="alert" />
				</div>

				<button>Submit Payment</button>
			</form>
		);
	}
}

export default PayDiv;
