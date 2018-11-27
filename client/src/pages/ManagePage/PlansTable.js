import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faCheck from "@fortawesome/fontawesome-free-solid/faCheck";
import faPlusCircle from "@fortawesome/fontawesome-free-solid/faPlusCircle";
import axios from "axios";

import SearchColumn from "../../components/SearchColumn/";
import PlanForm from "./PlanForm";

class PlansTable extends Component {
	state = {
		planFormActive: false,
		untouchedPlans: [],
		clickedPlan: null
	};
	constructor(props) {
		super(props);

		this.getPlans();
	}
	savePlan = plan => {
		axios.post("/api/plan", plan).then(res => {
			const { success, loggedIn } = res.data;
			if (loggedIn === false) this.props.history.push("/sign-in");

			if (success) alert("Success");
			else alert("Something went wrong message your local dev ninja (Peter)!");
			this.getPlans();
		});
	};
	getPlans = () => {
		axios.get("/api/plans").then(res => {
			let { loggedIn } = res.data;
			if (loggedIn === false) this.props.history.push("/sign-in");

			this.setState({ untouchedPlans: res.data });
		});
	};
	planFormActive = () => {
		this.setState({ planFormActive: !this.state.planFormActive, clickedPlan: null });
	};
	cancel = () => {
		this.setState({ planFormActive: false });
	};
	handlePlanClicked = plan => {
		this.setState({ planFormActive: true, clickedPlan: plan });
	};
	render() {
		const { planFormActive, clickedPlan, untouchedPlans } = this.state;
		return (
			<div>
				<div className="search-container">
					<SearchColumn
						objectList={untouchedPlans}
						handleClickedObject={this.handlePlanClicked}
						indexSearch="_id"
						indexSearch2="name"
						styleOverride={{ marginTop: "20px" }}
					/>
				</div>
				<FontAwesomeIcon onClick={this.planFormActive} className="create-plan-button" icon={faPlusCircle} size="2x" />
				{planFormActive && (
					<PlanForm updateParentState={this.cancel} savePlan={this.savePlan} clickedObject={clickedPlan} />
				)}
			</div>
		);
	}
}

export default PlansTable;
