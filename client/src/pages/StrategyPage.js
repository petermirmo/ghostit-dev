import React, { Component } from "react";

import "../css/theme.css";
import Header from "../components/HeaderComponent";
import StrategyForm from "../components/forms/StrategyForm";
import ConnectAccountsSideBar from "../components/ConnectAccountsSideBar";
import ClientsSideBar from "../components/ClientsSideBar";

class StrategyPage extends Component {
	state = {
		padding: { paddingTop: "50px" }
	};
	constructor(props) {
		super(props);
		this.increaseHeaderPadding = this.increaseHeaderPadding.bind(this);
	}
	increaseHeaderPadding() {
		this.setState({ padding: { paddingTop: "70px" } });
	}
	render() {
		return (
			<div id="wrapper" style={this.state.padding}>
				<Header activePage="strategy" updateParentState={this.increaseHeaderPadding} />
				<ConnectAccountsSideBar />
				<ClientsSideBar />

				<div className="center">
					<StrategyForm />
				</div>
			</div>
		);
	}
}

export default StrategyPage;
