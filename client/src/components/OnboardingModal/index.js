import React, { Component } from "react";

import CompetitorsTab from "./OnboardingTabs/CompetitorsTab";
import "./style.css";

class OnboardingModal extends Component {
	state = {
		activePageNumber: 1,
		totalPageNumber: 9,
		headerMessage: ""
	};
	changeTab = increment => {
		const { totalPageNumber } = this.state;
		let { activePageNumber } = this.state;
		activePageNumber += increment;
		if (activePageNumber > totalPageNumber || activePageNumber < 1) return;
		else this.setState({ activePageNumber: activePageNumber });
	};
	setHeaderMessage = headerMessage => {
		this.setState({ headerMessage: headerMessage });
	};
	render() {
		const { activePageNumber, totalPageNumber, headerMessage } = this.state;
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

						<h4 className="onboarding-title center">{headerMessage}</h4>
					</div>

					<div className="modal-body onboarding-body">
						{activePageNumber === 1 && <CompetitorsTab setHeaderMessage={this.setHeaderMessage} />}
					</div>
					<div className="modal-footer onboarding-footer">
						<div>
							<button className="back-button" onClick={() => this.changeTab(-1)}>
								<span className="fa fa-long-arrow-left fa-2x back-button-icon" /> Back
							</button>
						</div>
						<button className="next-button" onClick={() => this.changeTab(1)}>
							Next <span className="fa fa-long-arrow-right fa-2x next-button-icon" />
						</button>
					</div>
				</div>
			</div>
		);
	}
}
export default OnboardingModal;
