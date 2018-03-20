import React, { Component } from "react";

import "../../css/strategyForm.css";

class StrategyForm extends Component {
	state = {
		websiteInput: {
			placeholder: "Link to client website",
			className: "input-theme full-width",
			title: "Client website:",
			value: "",
			position: "left"
		},
		nameInput: {
			placeholder: "Name",
			className: "input-theme full-width",
			title: "Client name:",
			value: "",
			position: "left"
		},
		facebookLink: {
			placeholder: "Facebook link",
			className: "input-theme full-width",
			title: "Facebook link:",
			value: "",
			position: "left"
		},
		twitterLink: {
			placeholder: "Twitter link",
			className: "input-theme full-width",
			title: "Twitter link:",
			value: "",
			position: "left"
		},
		linkedinLink: {
			placeholder: "Linkedin link",
			className: "input-theme full-width",
			title: "Linkedin link:",
			value: "",
			position: "left"
		},
		instagramLink: {
			placeholder: "Instagram link",
			className: "input-theme full-width",
			title: "Instagram link:",
			value: "",
			position: "left"
		},
		questionnaireLink: {
			placeholder: "Questionnaire link",
			className: "input-theme full-width",
			title: "Link to questionnaire:",
			value: "",
			position: "left"
		},
		competitionTitle1: {
			placeholder: "Competition 1",
			className: "input-theme full-width",
			title: "Competition 1:",
			value: "",
			position: "center"
		},
		competitionUrl1: {
			placeholder: "Link to competition",
			className: "input-theme full-width",
			title: "Link to competition:",
			value: "",
			position: "center"
		},
		competitionTitle2: {
			placeholder: "Competition 2",
			className: "input-theme full-width",
			title: "Competition 2:",
			value: "",
			position: "center"
		},
		competitionUrl2: {
			placeholder: "Link to competition",
			className: "input-theme full-width",
			title: "Link to competition:",
			value: "",
			position: "center"
		},
		competitionTitle3: {
			placeholder: "Competition 3",
			className: "input-theme full-width",
			title: "Competition 3:",
			value: "",
			position: "center"
		},
		competitionUrl3: {
			placeholder: "Link to competition",
			className: "input-theme full-width",
			title: "Link to competition:",
			value: "",
			position: "center"
		},
		audience1: {
			placeholder: "Audience 1",
			className: "input-theme full-width",
			title: "Audience 1:",
			value: "",
			position: "right"
		},
		audience2: {
			placeholder: "Audience 2",
			className: "input-theme full-width",
			title: "Audience 2:",
			value: "",
			position: "right"
		},
		audience3: {
			placeholder: "Audience 3",
			className: "input-theme full-width",
			title: "Audience 3:",
			value: "",
			position: "right"
		},
		styleAndStructure: {
			placeholder: "Style and Structure",
			className: "input-theme full-width",
			title: "Style and Structure:",
			value: "",
			position: "right"
		},
		brandVoice: {
			placeholder: "Brand voice",
			className: "input-theme full-width",
			title: "Brand voice:",
			value: "",
			position: "right"
		},
		content: {
			placeholder: "Content",
			className: "input-theme full-width",
			title: "Content:",
			value: "",
			position: "right"
		},
		notes: {
			placeholder: "Notes",
			className: "input-theme full-width",
			title: "Notes:",
			value: "",
			position: "right"
		}
	};
	constructor(props) {
		super(props);
		this.handleFormChange = this.handleFormChange.bind(this);
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

	render() {
		var leftFormFields = [];
		var centerFormFields = [];
		var rightFormFields = [];
		for (var index in this.state) {
			var temp = (
				<div key={index}>
					<p className="input-title">{this.state[index].title}</p>
					<input
						id={index}
						type="text"
						placeholder={this.state[index].placeholder}
						className={this.state[index].className}
						value={index.value}
						onChange={this.handleFormChange}
					/>
				</div>
			);
			if (this.state[index].position === "left") {
				leftFormFields.push(temp);
			} else if (this.state[index].position === "center") {
				centerFormFields.push(temp);
			} else if (this.state[index].position === "right") {
				rightFormFields.push(temp);
			}
		}

		return (
			<form id="strategyForm" className="three-part-form">
				<div className="left-column center">
					<h2 className="form-title center">Client</h2>
					{leftFormFields}
				</div>
				<div className="center-column">
					<h2 className="form-title center">Client's Competition</h2>
					{centerFormFields}
				</div>
				<div className="right-column">
					<h2 className="form-title center">Brand</h2>
					{rightFormFields}
				</div>
			</form>
		);
	}
}

export default StrategyForm;
