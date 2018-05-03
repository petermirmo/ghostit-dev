import React, { Component } from "react";
import axios from "axios";

import PlanTable from "./PlanTable";
import { roleCheck } from "../../functions/CommonFunctions";

import "./style.css";

class PlansPage extends Component {
	state = {
		usersPlan: false
	};
	constructor(props) {
		super(props);

		roleCheck("demo");
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
				<PlanTable usersPlan={this.state.usersPlan} />
			</div>
		);
	}
}

export default PlansPage;
