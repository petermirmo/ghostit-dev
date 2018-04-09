import React, { Component } from "react";
import axios from "axios";

import Header from "../../components/Header/";
import ConnectAccountsSideBar from "../../components/SideBarAccounts/";
import PlanTable from "./PlanTable";

import "./style.css";

class PlansPage extends Component {
	state = {
		publicPlans: []
	};
	constructor(props) {
		super(props);
		this.getPublicPlans();
	}
	getPublicPlans = () => {
		axios.get("/api/plans/public").then(res => {
			this.setState({ publicPlans: res.data });
		});
	};
	render() {
		return (
			<div id="wrapper">
				<Header activePage="plans" />
				<ConnectAccountsSideBar />

				<div id="main">
					<PlanTable publicPlans={this.state.publicPlans} />
				</div>
			</div>
		);
	}
}

export default PlansPage;
