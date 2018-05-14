import React, { Component } from "react";

import CompetitorsTab from "../OnboardingTabs/CompetitorsTab/";
import TextareaTab from "../OnboardingTabs/TextareaTab/";
import BookCall from "../OnboardingTabs/BookCall/";
import "./style.css";

class OnboardingModal extends Component {
	state = {
		animateDirection: "animate-right",
		activePageNumber: 1,
		totalPageNumber: 5,
		headerMessage: "",
		audience: "",
		styleAndStructure: "",
		brand: "",
		notes: "",
		competitors: [
			{ placeholder: "Competitor", className: "strategy-input-theme", value: "" },
			{ placeholder: "Competitor", className: "strategy-input-theme", value: "" },
			{ placeholder: "Competitor", className: "strategy-input-theme", value: "" }
		]
	};

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
		let { competitors } = this.state;
		competitors[event.target.id] = {
			placeholder: competitors[event.target.id].placeholder,
			className: competitors[event.target.id].className,
			value: event.target.value
		};
		this.setState({
			competitors: competitors
		});
	};
	handleChange = (index, value) => {
		this.setState({ [index]: value });
	};

	updateCompetitors = competitors => {
		this.setState({ competitors: competitors });
	};
	render() {
		const { animateDirection, activePageNumber, totalPageNumber, headerMessage } = this.state;
		const { competitors, audience, brand, notes } = this.state;
		const { close } = this.props;

		return (
			<div className="modal center">
				<div className="modal-content onboarding-modal">
					{activePageNumber === totalPageNumber && (
						<p className="onboarding-close" onClick={close}>
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
							<div className={"active-tab " + animateDirection}>
								<CompetitorsTab
									setHeaderMessage={this.setHeaderMessage}
									competitors={competitors}
									handleFormChange={this.handleFormChange}
									updateCompetitors={this.updateCompetitors}
								/>
								<p className="onboarding-info">
									All we need is the name of 3 or more competitors! We will do the rest!
									<br />
									Note: This information is used to outrank your competition in google searches!
								</p>
							</div>
						)}
						{activePageNumber === 2 && (
							<div className={"active-tab " + animateDirection}>
								<TextareaTab
									handleChange={this.handleChange}
									placeholder="Waiting... :)"
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
						{activePageNumber === 3 && (
							<div className={"active-tab " + animateDirection}>
								<TextareaTab
									handleChange={this.handleChange}
									placeholder="RAWR!!!"
									className="onboarding-textarea"
									setHeaderMessage={this.setHeaderMessage}
									value={brand}
									index="brand"
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
						{activePageNumber === 4 && (
							<div className={"active-tab " + animateDirection}>
								<TextareaTab
									handleChange={this.handleChange}
									placeholder="Did we scare you? :D"
									className="onboarding-textarea"
									setHeaderMessage={this.setHeaderMessage}
									value={notes}
									index="notes"
									title="Anything Else You Would Like To Add?"
								/>
								<p className="onboarding-info">
									All we need is the name of 3 or more competitors! We will do the rest!
									<br />
									Note: This information is used to outrank your competition in google searches!
								</p>
							</div>
						)}
						{activePageNumber === 5 && (
							<div className={"active-tab " + animateDirection}>
								<BookCall
									setHeaderMessage={this.setHeaderMessage}
									className="book-call-hyperlink"
									link="https://calendly.com/ghostit/call-30"
									value="Book Your Call!"
									title="Last step!"
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
							<button className="next-button" onClick={() => this.changeTab(1, "animate-right")}>
								Next <span className="fa fa-long-arrow-right fa-2x next-button-icon" />
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}
}
export default OnboardingModal;
