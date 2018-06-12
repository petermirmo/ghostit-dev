import React, { Component } from "react";
import axios from "axios";

import PlanTable from "./PlanTable";

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
			let { loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			this.setState({ usersPlan: res.data });
		});
	};
	increaseHeaderPadding = () => {
		this.setState({ padding: { paddingTop: "70px" } });
	};
	render() {
		return (
			<div className="wrapper" style={this.props.margin}>
				<p className="plan-page-title center">
					Get Started With Ghostit <span className="plan-title-emphasis">Now</span>
				</p>
				<p className="plan-page-description">
					<span className="plan-description-title">What are you waiting for? </span>
					<br />
					Click the plus buttons to the right to customize your plan!
				</p>
				<PlanTable usersPlan={this.state.usersPlan} />
			</div>
		);
	}
}

export default PlansPage;
