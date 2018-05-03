import React, { Component } from "react";

import StrategyForm from "./StrategyForm";

class StrategyPage extends Component {
	state = {
		padding: { paddingTop: "50px" }
	};

	increaseHeaderPadding = () => {
		this.setState({ padding: { paddingTop: "70px" } });
	};
	render() {
		return (
			<div id="wrapper" style={this.state.padding}>
				<div className="center">
					<StrategyForm />
				</div>
			</div>
		);
	}
}

export default StrategyPage;
