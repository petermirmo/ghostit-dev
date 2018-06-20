import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faCheck from "@fortawesome/fontawesome-free-solid/faCheck";
import faTimes from "@fortawesome/fontawesome-free-solid/faTrash";
import { nonEditablePlanFields } from "../../extra/constants/PlanConstants";

class PlanForm extends Component {
	state = {
		plan: this.props.clickedObject
			? this.props.clickedObject
			: {
					socialPosts: 0,
					instagramPosts: 0,
					websiteBlogPosts: 0,
					emailNewsletters: 0,
					eBooks: 0,
					name: "peter_is_cool",
					price: 0
			  }
	};
	constructor(props) {
		super(props);
		this.handleFormChange = this.handleFormChange.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.clickedObject) this.setState({ plan: nextProps.clickedObject });
	}
	handleFormChange(event, index, index2) {
		let updatedPlan = this.state.plan;
		if (index2) {
			updatedPlan[index][index2] = event.target.value;
		} else {
			updatedPlan[index] = event.target.value;
		}
		this.setState({ plan: updatedPlan });
	}
	render() {
		const { savePlan, updateParentState } = this.props;

		let planAttributes = [];
		let attributes = this.state.plan;
		for (let index in attributes) {
			// Make sure it does not exist in array
			if (nonEditablePlanFields.indexOf(index) === -1) {
				let attribute = [];
				// Check if it is an object (if it is we need to loop through each attribute)
				if (attributes[index] === Object(attributes[index])) {
					for (let index2 in attributes[index]) {
						attribute.push(
							<input
								value={attributes[index][index2]}
								onChange={event => this.handleFormChange(event, index, index2)}
								className="plan-form-input"
								key={index2}
							/>
						);
					}
				} else {
					// Not an object
					attribute.push(
						<input
							value={attributes[index]}
							onChange={event => this.handleFormChange(event, index)}
							className="plan-form-input long-input"
							key={index}
						/>
					);
				}
				// Input Label
				planAttributes.push(
					<span className="plan-form-row" key={index}>
						<p className="plan-form-label">{index}</p>
						{attribute}
					</span>
				);
			}
		}
		return (
			<div className="plan-form">
				<span className="plan-form-header">
					<h4 className="plan-form-title-right">Amount</h4>
					<h4 className="plan-form-title-left">Name</h4>
				</span>
				{planAttributes}
				<div className="plan-form-footer">
					<FontAwesomeIcon
						onClick={() => savePlan(attributes)}
						className="attribute-footer-button"
						icon={faCheck}
						size="2x"
					/>
					<FontAwesomeIcon onClick={updateParentState} className="attribute-footer-button" icon={faTimes} size="2x" />
				</div>
			</div>
		);
	}
}
export default PlanForm;
