import React, { Component } from "react";

import "../../css/strategyForm.css";
import "font-awesome/css/font-awesome.min.css";

class StrategyForm extends Component {
	state = {
		questionnaireLink: {
			placeholder: "Example",
			className: "input-textarea",
			title: "Onboarding Questionnaire",
			value: "",
			rows: "1"
		},
		audience: {
			placeholder: "Example:",
			className: "input-textarea",
			title: "Audience",
			value: "",
			rows: "6"
		},
		styleAndStructure: {
			placeholder: "Example",
			className: "input-textarea",
			title: "Style and Structure:",
			value: "",
			rows: "6"
		},
		brandVoice: {
			placeholder: "Example",
			className: "input-textarea",
			title: "Brand voice:",
			value: "",
			rows: "6"
		},
		content: {
			placeholder: "Example",
			className: "input-textarea",
			title: "Content",
			value: "",
			rows: "6"
		},
		notes: {
			placeholder: "Example",
			className: "input-textarea",
			title: "Notes",
			value: "",
			rows: "6"
		},
		competitors: []
	};
	constructor(props) {
		super(props);
		this.handleFormChange = this.handleFormChange.bind(this);
		this.addCompetitor = this.addCompetitor.bind(this);
	}
	handleFormChange(event) {
		this.setState({
			[event.target.id]: {
				placeholder: this.state[event.target.id].placeholder,
				className: this.state[event.target.id].className,
				title: this.state[event.target.id].title,
				value: event.target.value,
				position: this.state[event.target.id].position
			}
		});
	}
	addCompetitor(event) {
		event.preventDefault();
		var competitor = {
			placeholder: "Competitor",
			className: "input-theme",
			value: ""
		};
		var temp = this.state.competitors;
		temp.push(competitor);
		this.setState({ competitors: temp });
	}

	render() {
		var formFields = [];
		var leftFormFields = [];
		var rightFormFields = [];
		var competitorDivs = [];
		for (var index in this.state) {
			if (index !== "competitors") {
				formFields.push(
					<div key={index}>
						<h3 className="form-title">{this.state[index].title}</h3>
						<br />
						<div className="input-container center">
							<textarea
								id={index}
								type="text"
								placeholder={this.state[index].placeholder}
								className={this.state[index].className}
								value={this.state[index].value}
								onChange={this.handleFormChange}
								rows={this.state[index].rows}
							/>
						</div>
					</div>
				);
			}
		}
		for (index in this.state.competitors) {
			competitorDivs.push(
				<div key={index}>
					<input
						id={index}
						type="text"
						placeholder={this.state.competitors[index].placeholder}
						className={this.state.competitors[index].className}
						value={this.state.competitors[index].value}
						onChange={this.handleFormChange}
					/>
				</div>
			);
		}

		return (
			<form id="strategyForm" className="full-form">
				<h3 className="form-title">Competitors</h3>
				<br />
				<div className="input-container center">
					{competitorDivs}
					<div className="icon-container">
						<button onClick={this.addCompetitor} className="fa fa-plus fa-2x white-button" />
					</div>
				</div>
				{formFields}
			</form>
		);
	}
}

export default StrategyForm;
