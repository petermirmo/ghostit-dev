import React, { Component } from "react";

import StrategyForm from "./StrategyForm";

class StrategyPage extends Component {
	render() {
		return (
			<div className="wrapper" style={this.props.margin} >
				<div className="center">
					<StrategyForm />
				</div>
			</div>
		);
	}
}

export default StrategyPage;
