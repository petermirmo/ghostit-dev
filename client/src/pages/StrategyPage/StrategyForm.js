import React, { Component } from "react";
import axios from "axios";

import "./style.css";
import "font-awesome/css/font-awesome.min.css";
import Loader from "../../components/Loader/";

import { strategyFormFields } from "../../constants/Common";

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
		competitors: [],
		saving: false
	};
	constructor(props) {
		super(props);
		this.findStrategyAndFillForm();
	}
	findStrategyAndFillForm = () => {
		axios.get("/api/strategy").then(res => {
			let strategy = res.data;
			delete strategy._id;
			delete strategy.__v;
			delete strategy.userID;
			if (strategy) {
				for (let index in strategy) {
					if (Array.isArray(strategy[index])) {
						let tempArray = [];
						for (let j in strategy[index]) {
							tempArray.push({
								value: strategy[index][j],
								placeholder: "Competitor",
								className: "strategy-input-theme"
							});
						}
						this.setState({ competitors: tempArray });
					} else {
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
	};

	handleFormChange = event => {
		if (Number.isInteger(Number(event.target.id))) {
			let temp = this.state.competitors;
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
	};
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
	saveStrategy = event => {
		event.preventDefault();
		let strategy = {};

		// Loop through state
		for (let index in this.state) {
			// If state element is an array we need to loop through each index of that array
			if (Array.isArray(this.state[index])) {
				let arrayTemp = [];
				for (let j in this.state[index]) {
					if (this.state[index][j].value !== "") {
						arrayTemp.push(this.state[index][j].value);
					}
				}
				strategy[index] = arrayTemp;
			} else {
				strategy[index] = this.state[index].value;
			}
		}
		axios.post("/api/strategy", strategy).then(res => {
			if (res.data) {
				this.setState({ saving: false });
			} else {
				this.setState({ saving: false });
				alert("Something went wrong! Contact your local Dev Ninja! :D");
			}
		});
	};

	render() {
		const { competitors } = this.state;
		let formFields = [];
		let competitorDivs = [];
		for (let i in strategyFormFields) {
			let index = strategyFormFields[i];
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
			}
		}

		return (
			<form id="strategyForm" className="full-form">
				<h3 className="form-title">Competitors</h3>
				<br />
				<div className="input-container center">
					{competitorDivs}
					<div className="icon-container">
						<button onClick={this.addCompetitor} className="fa fa-plus fa-2x add-competitor" />
					</div>
				</div>
				{formFields}
				<button
					onClick={event => {
						this.setState({ saving: true });
						this.saveStrategy(event);
					}}
					className="big-purple-submit-button"
				>
					Save Strategy!
				</button>
				{this.state.saving && <Loader />}
			</form>
		);
	}
}

export default StrategyForm;
