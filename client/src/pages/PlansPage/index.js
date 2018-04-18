import React, { Component } from "react";
import axios from "axios";

import Header from "../../components/Header/";
import ConnectAccountsSideBar from "../../components/SideBarAccounts/";
import PlanTable from "./PlanTable";
import ClientsSideBar from "../../components/SideBarClients/";

import "./style.css";

class PlansPage extends Component {
	state = {
		usersPlan: false
	};
	constructor(props) {
		super(props);
		this.getUsersAssignedPlan();
	}
	getUsersAssignedPlan = () => {
		axios.get("/api/user/plan").then(res => {
			this.setState({ usersPlan: res.data });
		});
	};
	increaseHeaderPadding = () => {
		this.setState({ padding: { paddingTop: "70px" } });
	};
	render() {
		return (
			<div id="wrapper">
				<Header activePage="plans" updateParentState={this.increaseHeaderPadding} />
				<ConnectAccountsSideBar />
				<ClientsSideBar />

				<div id="main">
					<PlanTable usersPlan={this.state.usersPlan} />
				</div>
			</div>
		);
	}
}

export default PlansPage;
