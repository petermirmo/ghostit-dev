import React, { Component } from "react";

import Calendar from "./Calendar";
import OnboardingModal from "../../components/OnboardingModal/";

class Content extends Component {
	state = {
		newClient: false
	};
	closeOnboardingModal = () => {
		this.setState({ newClient: false });
	};
	render() {
		const { newClient } = this.state;
		return (
			<div id="wrapper">
				{newClient && <OnboardingModal close={this.closeOnboardingModal} />}
				<Calendar />
			</div>
		);
	}
}
export default Content;
