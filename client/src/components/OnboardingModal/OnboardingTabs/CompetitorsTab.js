import React, { Component } from "react";

class OnboardingModal extends Component {
	state = {
		competitors: []
	};
	constructor(props) {
		super(props);
		props.setHeaderMessage("Tell us about your competition!");
	}

	addCompetitor = event => {
		event.preventDefault();
		let competitor = {
			placeholder: "Competitor",
			className: "strategy-input-theme",
			value: ""
		};
		let temp = this.state.competitors;
		temp.push(competitor);
		this.setState({ competitors: temp });
	};
	render() {
		let competitorDivs = [];
		const { competitors } = this.state;
		for (let index in competitors) {
			competitorDivs.push(
				<div key={index}>
					<input
						id={index}
						type="text"
						placeholder={competitors[index].placeholder}
						className={competitors[index].className}
						value={competitors[index].value}
						onChange={this.handleFormChange}
					/>
				</div>
			);
		}
		return (
			<div className="competitor-input">
				{competitorDivs}
				<div className="icon-container">
					<button onClick={this.addCompetitor} className="fa fa-plus fa-2x add-competitor" />
				</div>
			</div>
		);
	}
}
export default OnboardingModal;
