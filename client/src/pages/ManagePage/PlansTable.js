import React, { Component } from "react";
import axios from "axios";

import ManageColumn from "../../components/SearchColumn/index";
import ObjectEditTable from "../../components/ObjectEditTable/ObjectEditTable";
import PlanForm from "./PlanForm";

class PlansTable extends Component {
	state = {
		createPlan: false
	};
	constructor(props) {
		super(props);
		this.createPlan = this.createPlan.bind(this);
	}
	savePlan() {}
	getPlans() {}
	createPlan() {
		this.setState({ createPlan: true });
	}
	render() {
		let array;
		let planDivs = [];

		return (
			<div>
				<button onClick={this.createPlan}>Create Plan</button>
				{this.state.createPlan && <PlanForm />}
			</div>
		);
	}
}

export default PlansTable;
