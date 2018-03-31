import React, { Component } from "react";

import Header from "../../components/Header/index";
import StrategyForm from "./StrategyForm";
import ConnectAccountsSideBar from "../../components/SideBarAccounts/SideBarAccounts";
import ClientsSideBar from "../../components/SideBarClients/SideBarClients";

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
