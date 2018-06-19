import React, { Component } from "react";

import PayDiv from "./PayDiv";

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

	componentWillReceiveProps(nextProps) {
		if (nextProps.usersPlan) this.setState(nextProps.usersPlan);
	}
	increment = (index, value, unitsOfContent) => {
		if (this.props.usersPlan) return;
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

	render() {
		const { unitsOfContent } = this.state;
		let onboardingFeeDiv;
		let overThreeHundredWarning;

		if (unitsOfContent < 2 && !this.state.price)
			overThreeHundredWarning = <h4 className="warning">Plan must be over $300</h4>;

		if (!this.state.checkbox) {
			onboardingFeeDiv = <h3 className="warning">+ $200 One time onboarding fee</h3>;
		}
		let price;
		if (unitsOfContent > 2) {
			price = (unitsOfContent - 2) * 120 + 2 * 150;
		} else {
			price = unitsOfContent * 150;
		}

		if (this.state.price) {
			price = this.state.price;
		}
		return (
			<div className="plan-container">
				<div>
					<div className="plan-row">
						<p className="plan-row-label">Website Blog Posts </p>
						<button
							onClick={() => this.increment("websiteBlogPosts", 1, 1)}
							className="fa fa-plus fa-2x plan-row-increment"
						/>
						<h2 className="plan-row-value">{this.state.websiteBlogPosts}</h2>
						<button
							onClick={() => this.increment("websiteBlogPosts", -1, -1)}
							className="fa fa-minus fa-2x plan-row-increment minus"
						/>
					</div>

					<div className="plan-row">
						<p className="plan-row-label">Social Posts (Facebook, Twitter, Linkedin) </p>
						<button
							onClick={() => this.increment("socialPosts", 15, 1)}
							className="fa fa-plus fa-2x plan-row-increment"
						/>
						<h2 className="plan-row-value">{this.state.socialPosts}</h2>
						<button
							onClick={() => this.increment("socialPosts", -15, -1)}
							className="fa fa-minus fa-2x plan-row-increment minus"
						/>
					</div>

					<div className="plan-row">
						<p className="plan-row-label">Instagram Posts </p>
						<button
							onClick={() => this.increment("instagramPosts", 15, 2)}
							className="fa fa-plus fa-2x plan-row-increment"
						/>
						<h2 className="plan-row-value">{this.state.instagramPosts}</h2>
						<button
							onClick={() => this.increment("instagramPosts", -15, -2)}
							className="fa fa-minus fa-2x plan-row-increment minus"
						/>
					</div>

					<div className="plan-row">
						<p className="plan-row-label">Email Newsletters </p>
						<button
							onClick={() => this.increment("emailNewsletters", 1, 1)}
							className="fa fa-plus fa-2x plan-row-increment"
						/>
						<h2 className="plan-row-value">{this.state.emailNewsletters}</h2>
						<button
							onClick={() => this.increment("emailNewsletters", -1, -1)}
							className="fa fa-minus fa-2x plan-row-increment minus"
						/>
					</div>

					<div className="plan-row">
						<p className="plan-row-label">E-books </p>
						<button onClick={() => this.increment("eBooks", 1, 1)} className="fa fa-plus fa-2x plan-row-increment" />
						<h2 className="plan-row-value">{this.state.eBooks}</h2>
						<button
							onClick={() => this.increment("eBooks", -1, -1)}
							className="fa fa-minus fa-2x plan-row-increment minus"
						/>
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
						<h1 className="plan-row-value">${price}</h1>
					</div>
				</div>
				<div className="plan-footer">
					{onboardingFeeDiv}
					{overThreeHundredWarning}
					{(unitsOfContent > 1 || this.state.price) && <PayDiv plan={this.state} />}
				</div>
			</div>
		);
	}
}

export default PlanTable;
