import React, { Component } from "react";

import Header from "../../components/Header/";
import StrategyForm from "./StrategyForm";
import ConnectAccountsSideBar from "../../components/SideBarAccounts/";
import ClientsSideBar from "../../components/SideBarClients/";

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
