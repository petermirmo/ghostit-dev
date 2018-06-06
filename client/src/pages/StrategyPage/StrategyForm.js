import React, { Component } from "react";
import Textarea from "react-textarea-autosize";
import axios from "axios";

import CompetitorsTab from "../../components/Onboarding/OnboardingTabs/Competitors/";
import "./style.css";
import "font-awesome/css/font-awesome.min.css";
import Loader from "../../components/Notifications/Loader/";

import { strategyFormFields } from "../../extra/constants/Common";

class StrategyForm extends Component {
	state = {
		questionnaire: {
			placeholder: "Example",
			className: "input-textarea",
			title: "Keywords You're Trying To Rank For",
			value: ""
		},
		audience: {
			placeholder: "Example:",
			className: "input-textarea",
			title: "Audience",
			value: ""
		},
		styleAndStructure: {
			placeholder: "Example",
			className: "input-textarea",
			title: "Style and Structure:",
			value: ""
		},
		brandVoice: {
			placeholder: "Example",
			className: "input-textarea",
			title: "Brand voice:",
			value: ""
		},
		content: {
			placeholder: "Example",
			className: "input-textarea",
			title: "Content",
			value: ""
		},
		notes: {
			placeholder: "Example",
			className: "input-textarea",
			title: "Notes",
			value: ""
		},
		competitors: [],
		saving: false,
		saveButtonOpacity: 0.4
	};
	constructor(props) {
		super(props);
		this.findStrategyAndFillForm();
	}
	findStrategyAndFillForm = () => {
		axios.get("/api/strategy").then(res => {
			let { strategy, loggedIn } = res.data;

			if (loggedIn === false) window.location.reload();

			if (strategy) {
				delete strategy._id;
				delete strategy.__v;
				delete strategy.userID;
				for (let index in strategy) {
					if (index === "competitors") {
						let tempArray = [];
						for (let j in strategy[index]) {
							tempArray.push(strategy[index][j]);
						}
						this.setState({ competitors: tempArray });
					} else {
						this.setState({
							[index]: {
								placeholder: this.state[index].placeholder,
								className: this.state[index].className,
								title: this.state[index].title,
								value: strategy[index]
							}
						});
					}
				}
			}
		});
	};

	handleFormChange = event => {
		this.setState({ saveButtonOpacity: 1 });
		if (Number.isInteger(Number(event.target.id))) {
			let temp = this.state.competitors;
			temp[event.target.id] = event.target.value;
			this.setState({
				competitors: temp
			});
		} else {
			this.setState({
				[event.target.id]: {
					placeholder: this.state[event.target.id].placeholder,
					className: this.state[event.target.id].className,
					title: this.state[event.target.id].title,
					value: event.target.value
				}
			});
		}
	};

	saveStrategy = event => {
		let strategy = {};

		// Loop through state
		for (let index in this.state) {
			// If state element is an array we need to loop through each index of that array
			if (Array.isArray(this.state[index])) {
				strategy[index] = this.state[index];
			} else {
				strategy[index] = this.state[index].value;
			}
		}
		axios.post("/api/strategy", strategy).then(res => {
			let { loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			if (res.data) {
				this.setState({ saving: false, saveButtonOpacity: 0.4 });
			} else {
				this.setState({ saving: false });
				alert("Something went wrong! Contact your local Dev Ninja! :D");
			}
		});
	};
	updateCompetitors = competitors => {
		this.setState({ competitors: competitors });
	};
	updateTextAreaHeight = event => {
		event.style.height = "1px";
		event.style.height = 25 + event.scrollHeight + "px";
	};

	render() {
		const { competitors, saveButtonOpacity } = this.state;

		let formFields = [];
		for (let i in strategyFormFields) {
			let index = strategyFormFields[i];
			if (!Array.isArray(this.state[index])) {
				formFields.push(
					<div key={index}>
						<h3 className="form-title">{this.state[index].title}</h3>
						<br />
						<div className="input-container center">
							<Textarea
								id={index}
								type="text"
								placeholder={this.state[index].placeholder}
								className={this.state[index].className}
								value={this.state[index].value}
								onChange={this.handleFormChange}
							/>
						</div>
					</div>
				);
			}
		}

		return (
			<div className="full-form">
				<h3 className="form-title">Competitors</h3>
				<br />

				<div className="input-container center">
					<CompetitorsTab
						competitors={competitors}
						handleFormChange={this.handleFormChange}
						updateCompetitors={this.updateCompetitors}
					/>
				</div>
				{formFields}
				<button
					onClick={event => {
						this.setState({ saving: true });
						this.saveStrategy(event);
					}}
					className="big-purple-submit-button"
					style={{ opacity: saveButtonOpacity }}
				>
					Save Strategy!
				</button>
				{this.state.saving && <Loader />}
			</div>
		);
	}
}

export default StrategyForm;
