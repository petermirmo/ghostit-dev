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
		activePlans: [],
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
			if (loggedIn === false) window.location.reload();

			if (success) alert("Success");
			else alert("Something went wrong message your local dev ninja (Peter)!");
			this.getPlans();
		});
	};
	getPlans = () => {
		axios.get("/api/plans").then(res => {
			let { loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			this.setState({ activePlans: res.data, untouchedPlans: res.data });
		});
	};
	planFormActive = () => {
		this.setState({ planFormActive: !this.state.planFormActive, clickedPlan: null });
	};
	cancel = () => {
		this.setState({ planFormActive: false });
	};
	handlePlanClicked = event => {
		this.setState({ planFormActive: true, clickedPlan: this.state.activePlans[event.target.id] });
	};
	searchPlans = event => {
		let value = event.target.value;
		if (!value) {
			this.setState({ activePlans: this.state.untouchedPlans });
			return;
		}
		let stringArray = value.split(" ");

		let plans = [];
		// Loop through all plans
		for (let index in this.state.untouchedPlans) {
			let matchFound = false;
			// Loop through all words in the entered value
			for (let j in stringArray) {
				// Make sure we are not checking an empty string
				if (stringArray[j]) {
					// Check to see if a part of the string matches user's fullName or email
					if (this.state.untouchedPlans[index].name) {
						if (this.state.untouchedPlans[index].name.includes(stringArray[j])) {
							matchFound = true;
						}
					}
					if (this.state.untouchedPlans[index]._id) {
						if (this.state.untouchedPlans[index]._id.includes(stringArray[j])) {
							matchFound = true;
						}
					}
				}
			}
			if (matchFound) {
				plans.push(this.state.untouchedPlans[index]);
			}
		}
		this.setState({ activePlans: plans });
	};
	render() {
		const { activePlans, planFormActive, clickedPlan } = this.state;
		return (
			<div>
				<SearchColumn
					objectList={activePlans}
					handleClickedObject={this.handlePlanClicked}
					searchObjects={this.searchPlans}
					styleOverride={{ marginTop: "20px" }}
				/>
				<FontAwesomeIcon onClick={this.planFormActive} className="create-plan-button" icon={faPlusCircle} size="2x" />
				{planFormActive && (
					<PlanForm updateParentState={this.cancel} savePlan={this.savePlan} clickedObject={clickedPlan} />
				)}
			</div>
		);
	}
}

export default PlansTable;
