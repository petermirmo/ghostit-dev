import React, { Component } from "react";
import axios from "axios";

import Header from "../../components/Header/";
import ConnectAccountsSideBar from "../../components/SideBarAccounts/";
import PlanTable from "./PlanTable";

import "./style.css";

class PlansPage extends Component {
	state = {
		publicPlans: {}
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
	render() {
		return (
			<div id="wrapper">
				<Header activePage="plans" />
				<ConnectAccountsSideBar />

				<div id="main">
					<PlanTable usersPlan={this.state.usersPlan} />
				</div>
			</div>
		);
	}
}

export default PlansPage;
