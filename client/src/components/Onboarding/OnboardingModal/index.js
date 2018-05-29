import React, { Component } from "react";
import axios from "axios";

import Notification from "../../../components/Notifications/Notification/";
import IntroTab from "../OnboardingTabs/Intro/";
import CompetitorsTab from "../OnboardingTabs/Competitors/";
import TextareaTab from "../OnboardingTabs/Textarea/";
import BookCall from "../OnboardingTabs/BookCall/";
import "./style.css";

class OnboardingModal extends Component {
	state = {
		animateDirection: "animate-right",
		activePageNumber: 1,
		totalPageNumber: 6,
		headerMessage: "",
		strategy: {
			audience: "",
			styleAndStructure: "",
			brandVoice: "",
			notes: "",
			competitors: ["", "", ""]
		},
		notification: {
			on: false,
			title: "",
			message: "",
			type: "danger"
		}
	};
	constructor(props) {
		super(props);
		axios.get("/api/strategy").then(res => {
			const { strategy, success } = res.data;
			if (success) {
				const { competitors, audience, styleAndStructure, brandVoice, notes } = strategy;
				let tempCompetitors = [];
				if (competitors.length === 0) {
					tempCompetitors = ["", "", ""];
				} else {
					for (let index in competitors) {
						tempCompetitors.push(competitors[index]);
					}
				}
				this.setState({
					strategy: {
						competitors: tempCompetitors,
						audience: audience,
						styleAndStructure: styleAndStructure,
						brandVoice: brandVoice,
						notes: notes
					}
				});
			}
		});
	}

	changeTab = (increment, animateDirection) => {
		const { totalPageNumber } = this.state;
		let { activePageNumber } = this.state;
		activePageNumber += increment;
		if (activePageNumber > totalPageNumber || activePageNumber < 1) return;
		else this.setState({ activePageNumber: activePageNumber, animateDirection: animateDirection });
	};
	setHeaderMessage = headerMessage => {
		this.setState({ headerMessage: headerMessage });
	};

	handleFormChange = event => {
		let { strategy } = this.state;
		let { competitors } = this.state.strategy;
		competitors[event.target.id] = event.target.value;

		strategy.competitors = competitors;
		this.setState({
			strategy: strategy
		});
	};
	handleChange = (index, value) => {
		let { strategy } = this.state;
		strategy[index] = value;
		this.setState({ strategy: strategy });
	};

	updateCompetitors = competitors => {
		this.setState({ competitors: competitors });
	};
	notify = notificationObject => {
		const { title, message, type } = notificationObject;

		let { notification } = this.state;
		notification.on = !notification.on;

		if (title) notification.title = title;
		if (message) notification.message = message;
		if (type) notification.type = type;

		this.setState({ notification: notification });

		if (notification.on) {
			setTimeout(() => {
				let { notification } = this.state;
				notification.on = false;
				this.setState({ notification: notification });
			}, 1500);
		}
	};
	saveStrategy = () => {
		let strategy = this.state.strategy;
		let temp = [];
		for (let index in strategy.competitors) {
			if (strategy.competitors[index].value) temp(strategy[index].value);
		}
		axios.post("/api/strategy", strategy).then(res => {
			if (res.data) {
				/*this.notify({
					title: "Success!",
					message: "Strategy saved :)",
					type: "success"
				});*/
			} else {
			}
		});
	};

	render() {
		const { animateDirection, activePageNumber, totalPageNumber, headerMessage, notification } = this.state;
		const { competitors, audience, brandVoice, notes } = this.state.strategy;
		const { close } = this.props;

		return (
			<div className="modal center">
				<div className="modal-content onboarding-modal">
					{activePageNumber === totalPageNumber && (
						<p
							className="onboarding-close"
							onClick={() => {
								this.props.changePage("strategy");
								close();
							}}
						>
							&times;
						</p>
					)}
					<div className="modal-header onboarding-header">
						<p className="active-page-of-total">
							{activePageNumber} of {totalPageNumber}
						</p>
						<h4 className={"onboarding-title center " + animateDirection}>{headerMessage}</h4>
					</div>

					<div className="modal-body onboarding-body">
						{activePageNumber === 1 && (
							<IntroTab setHeaderMessage={this.setHeaderMessage} title="Tell Us About Your Business!" />
						)}
						{activePageNumber === 2 && (
							<div className={"active-tab " + animateDirection}>
								<CompetitorsTab
									setHeaderMessage={this.setHeaderMessage}
									competitors={competitors}
									handleFormChange={this.handleFormChange}
									updateCompetitors={this.updateCompetitors}
									title="Tell Us About Your Competition!"
								/>
								<p className="onboarding-info">
									All we need is the name of 3 or more competitors! We will do the rest!
									<br />
									Note: This information is used to outrank your competition in google searches!
								</p>
							</div>
						)}
						{activePageNumber === 3 && (
							<div className={"active-tab " + animateDirection}>
								<TextareaTab
									handleChange={this.handleChange}
									placeholder="RAWR!!!"
									className="onboarding-textarea"
									setHeaderMessage={this.setHeaderMessage}
									value={audience}
									index="audience"
									title="Tell Us About Your Audience!"
								/>
								<p className="onboarding-info">
									Example: We sell to tech companies, 1-15 employees based in US, UK, Canada and Australia. The decision
									maker in these companies are marketing managers and the problems they are looking to solve are content
									marketing strategy, content marketing production, user acquisition, generating more website inbound.
								</p>
							</div>
						)}
						{activePageNumber === 4 && (
							<div className={"active-tab " + animateDirection}>
								<TextareaTab
									handleChange={this.handleChange}
									placeholder="Did we scare you? :D"
									className="onboarding-textarea"
									setHeaderMessage={this.setHeaderMessage}
									value={brandVoice}
									index="brandVoice"
									title="Tell Us About Your Brand!"
								/>
								<p className="onboarding-info">
									Example: Our brand voice is fun somewhat cheeky, educational, informative and actionable.
									<br />
									We look for insparation like Ahrefs, nerd wallet, hubspot.
									<br />
									Things we look to avoid: generic, non-actionable, non-value additive content.
								</p>
							</div>
						)}
						{activePageNumber === 5 && (
							<div className={"active-tab " + animateDirection}>
								<TextareaTab
									handleChange={this.handleChange}
									placeholder="Waiting... :)"
									className="onboarding-textarea"
									setHeaderMessage={this.setHeaderMessage}
									value={notes}
									index="notes"
									title="Anything Else You Would Like To Add?"
								/>
								<p className="onboarding-info">
									This can be anything! If you want to send us a happy face, send us a happy face :)
								</p>
							</div>
						)}
						{activePageNumber === 6 && (
							<div className={"active-tab " + animateDirection}>
								<BookCall
									setHeaderMessage={this.setHeaderMessage}
									className="book-call-hyperlink"
									link="https://calendly.com/ghostit/call-30"
									value="Book Your Call!"
									title="Last Step!"
								/>
							</div>
						)}
					</div>

					<div className="modal-footer onboarding-footer">
						{activePageNumber !== 1 && (
							<button className="back-button" onClick={() => this.changeTab(-1, "animate-left")}>
								<span className="fa fa-long-arrow-left fa-2x back-button-icon" /> Back
							</button>
						)}
						{activePageNumber !== totalPageNumber && (
							<button
								className="next-button"
								onClick={() => {
									this.saveStrategy();

									this.changeTab(1, "animate-right");
								}}
							>
								Next <span className="fa fa-long-arrow-right fa-2x next-button-icon" />
							</button>
						)}
					</div>
				</div>
				{notification.on && (
					<Notification
						title={notification.title}
						message={notification.message}
						notificationType={notification.type}
						callback={this.notify}
					/>
				)}
			</div>
		);
	}
}
export default OnboardingModal;
