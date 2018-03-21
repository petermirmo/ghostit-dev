import React, { Component } from "react";
import axios from "axios";

import "../../css/strategyForm.css";
import "font-awesome/css/font-awesome.min.css";

class StrategyForm extends Component {
	state = {
		questionnaire: {
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
		this.saveStrategy = this.saveStrategy.bind(this);
		this.findStrategyAndFillForm = this.findStrategyAndFillForm.bind(this);
		this.findStrategyAndFillForm();
	}
	findStrategyAndFillForm() {
		axios.get("/api/strategy").then(res => {
			var strategy = res.data;
			delete strategy._id;
			delete strategy.__v;
			delete strategy.userID;
			if (strategy) {
				for (var index in strategy) {
					if (Array.isArray(strategy[index])) {
						var tempArray = [];
						for (var j in strategy[index]) {
							tempArray.push({
								value: strategy[index][j],
								placeholder: "Competitor",
								className: "input-theme"
							});
						}
						this.setState({ competitors: tempArray });
					} else {
						console.log(index);
						this.setState({
							[index]: {
								placeholder: this.state[index].placeholder,
								className: this.state[index].className,
								title: this.state[index].title,
								value: strategy[index],
								rows: this.state[index].rows
							}
						});
					}
				}
			}
		});
	}
	handleFormChange(event) {
		if (Number.isInteger(Number(event.target.id))) {
			var temp = this.state.competitors;
			temp[event.target.id] = {
				placeholder: this.state.competitors[event.target.id].placeholder,
				className: this.state.competitors[event.target.id].className,
				value: event.target.value
			};
			this.setState({
				competitors: temp
			});
		} else {
			this.setState({
				[event.target.id]: {
					placeholder: this.state[event.target.id].placeholder,
					className: this.state[event.target.id].className,
					title: this.state[event.target.id].title,
					value: event.target.value,
					rows: this.state[event.target.id].rows
				}
			});
		}
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
	saveStrategy(event) {
		event.preventDefault();
		var strategy = {};

		// Loop through state
		for (var index in this.state) {
			// If state element is an array we need to loop through each index of that array
			if (Array.isArray(this.state[index])) {
				var arrayTemp = [];
				for (var j in this.state[index]) {
					arrayTemp.push(this.state[index][j].value);
				}
				strategy[index] = arrayTemp;
			} else {
				strategy[index] = this.state[index].value;
			}
		}
		axios.post("/api/strategy", strategy).then(res => {
			console.log(res);
		});
	}

	render() {
		var formFields = [];
		var leftFormFields = [];
		var rightFormFields = [];
		var competitorDivs = [];
		for (var index in this.state) {
			if (!Array.isArray(this.state[index])) {
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
			} else {
				for (var j in this.state.competitors) {
					competitorDivs.push(
						<div key={j}>
							<input
								id={j}
								type="text"
								placeholder={this.state.competitors[j].placeholder}
								className={this.state.competitors[j].className}
								value={this.state.competitors[j].value}
								onChange={this.handleFormChange}
							/>
						</div>
					);
				}
			}
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
				<button onClick={this.saveStrategy} className="big-purple-submit-button">
					Save Strategy!
				</button>
			</form>
		);
	}
}

export default StrategyForm;
