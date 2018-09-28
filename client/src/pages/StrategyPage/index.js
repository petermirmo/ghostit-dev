import React, { Component } from "react";

import StrategyForm from "./StrategyForm";
import "./styles/";

class StrategyPage extends Component {
	render() {
		return (
			<div  >
				<div className="center">
					<StrategyForm />
				</div>
			</div>
		);
	}
}

export default StrategyPage;
