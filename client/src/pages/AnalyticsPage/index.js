import React, { Component } from "react";

import OptionModal from "../../components/OptionModal";
import CampaignModal from "../../components/CampaignModal";
import "./styles/";

class Analytics extends Component {
	state = {
		optionModal: false,
		campaignModal: true
	};
	handleChange = (value, index) => {
		this.setState({ [index]: value });
	};
	render() {
		const { optionModal, campaignModal } = this.state;
		return (
			<div className="wrapper" style={this.props.margin}>
				<button className="activate-test-button" onClick={() => this.handleChange(true, "optionModal")}>
					Click Here!
				</button>
				{optionModal && <OptionModal handleChange={this.handleChange} />}
				{campaignModal && <CampaignModal handleChange={this.handleChange} />}
			</div>
		);
	}
}
export default Analytics;
