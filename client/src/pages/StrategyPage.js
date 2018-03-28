import React, { Component } from "react";

import "../css/theme.css";
import Header from "../components/HeaderComponent";
import StrategyForm from "../components/forms/StrategyForm";
import ConnectAccountsSideBar from "../components/ConnectAccountsSideBar";

class StrategyPage extends Component {
	render() {
		return (
			<div id="wrapper">
				<Header activePage="strategy" />
				<ConnectAccountsSideBar />

				<div className="center">
					<StrategyForm />
				</div>
			</div>
		);
	}
}

export default StrategyPage;
