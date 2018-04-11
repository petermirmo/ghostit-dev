import React, { Component } from "react";
import axios from "axios";

import * as PlanConstants from "../../Constants/PlanConstants";
import PayDiv from "./PayDiv";

import "./style.css";
import "font-awesome/css/font-awesome.min.css";

class PlanTable extends Component {
	state = {
		websiteBlogPosts: 0,
		socialPosts: 0,
		instagramPosts: 0,
		emailNewsletters: 0,
		eBooks: 0,
		checkbox: true,
		unitsOfContent: 0
	};
	increment = (index, value, unitsOfContent) => {
		// Make sure value cannot go below 0
		if (this.state[index] === 0 && value < 0) {
			return;
		}

		this.setState({
			[index]: this.state[index] + value,
			unitsOfContent: this.state.unitsOfContent + unitsOfContent
		});
	};

	handleCheckBox = () => {
		this.setState({ checkbox: !this.state.checkbox });
	};
	signUp = () => {
		axios.post("/api/signUpToPlan", this.state).then(res => {
			console.log(res);
		});
	};

	render() {
		const { unitsOfContent } = this.state;
		let onboardingFeeDiv;
		let signUpButton;
		let overThreeHundredWarning;

		if (unitsOfContent > 2)
			signUpButton = (
				<button className="sign-up center" onClick={this.signUp}>
					Become Awesome!
				</button>
			);
		else overThreeHundredWarning = <h4 className="warning">Plan must be over $300</h4>;

		if (!this.state.checkbox) {
			onboardingFeeDiv = <h3 className="warning">+ $200 One time onboarding fee</h3>;
		}
		let price = 0;
		let discount = 150;
		for (let i = 0; i < unitsOfContent; i++) {
			if (i > 1 && discount > 100) {
				discount = discount - 2.5;
			}
			price = price + discount;
		}
		return (
			<div className="plan-container center">
				<div>
					<div className="plan-row">
						<p className="plan-row-label">Website Blog Posts </p>
						<button
							onClick={() => this.increment("websiteBlogPosts", 1, 1)}
							className="fa fa-plus fa-2x plan-row-increment"
						/>
						<button
							onClick={() => this.increment("websiteBlogPosts", -1, -1)}
							className="fa fa-minus fa-2x plan-row-increment"
						/>
						<h2 className="plan-row-value">{this.state.websiteBlogPosts}</h2>
					</div>

					<div className="plan-row">
						<p className="plan-row-label">Social Posts (Facebook, Twitter, Linkedin) </p>
						<button
							onClick={() => this.increment("socialPosts", 15, 1)}
							className="fa fa-plus fa-2x plan-row-increment"
						/>
						<button
							onClick={() => this.increment("socialPosts", -15, -1)}
							className="fa fa-minus fa-2x plan-row-increment"
						/>
						<h2 className="plan-row-value">{this.state.socialPosts}</h2>
					</div>

					<div className="plan-row">
						<p className="plan-row-label">Instagram Posts </p>
						<button
							onClick={() => this.increment("instagramPosts", 15, 2)}
							className="fa fa-plus fa-2x plan-row-increment"
						/>
						<button
							onClick={() => this.increment("instagramPosts", -15, -2)}
							className="fa fa-minus fa-2x plan-row-increment"
						/>
						<h2 className="plan-row-value">{this.state.instagramPosts}</h2>
					</div>

					<div className="plan-row">
						<p className="plan-row-label">Email Newsletters </p>
						<button
							onClick={() => this.increment("emailNewsletters", 1, 1)}
							className="fa fa-plus fa-2x plan-row-increment"
						/>
						<button
							onClick={() => this.increment("emailNewsletters", -1, -1)}
							className="fa fa-minus fa-2x plan-row-increment"
						/>
						<h2 className="plan-row-value">{this.state.emailNewsletters}</h2>
					</div>

					<div className="plan-row">
						<p className="plan-row-label">E-books </p>
						<button onClick={() => this.increment("eBooks", 1, 3)} className="fa fa-plus fa-2x plan-row-increment" />
						<button onClick={() => this.increment("eBooks", -1, -3)} className="fa fa-minus fa-2x plan-row-increment" />
						<h2 className="plan-row-value">{this.state.eBooks}</h2>
					</div>

					<div className="plan-row">
						<p className="plan-row-label">Content Marketing Strategy </p>
						<div className="fa fa-check-circle fa-2x checkmark" />
					</div>

					<div className="plan-row">
						<p className="plan-row-label">Six Month Commitment </p>
						<input type="checkbox" defaultChecked={this.state.checkbox} onChange={this.handleCheckBox} />
					</div>

					<div className="plan-row">
						<h3 className="plan-row-label">Monthly Price </h3>
						<h1 className="plan-row-value">{price}</h1>
					</div>
				</div>
				<div className="plan-footer">
					{signUpButton}
					{onboardingFeeDiv}
					{overThreeHundredWarning}
					<PayDiv />
				</div>
			</div>
		);
	}
}

export default PlanTable;
