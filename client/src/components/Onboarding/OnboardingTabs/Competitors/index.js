import React, { Component } from "react";
import "./styles/";

class CompetitorsTab extends Component {
	constructor(props) {
		super(props);
		if (props.setHeaderMessage) props.setHeaderMessage(props.title);
	}

	addCompetitor = () => {
		let { competitors } = this.props;

		competitors.push("");
		this.props.updateCompetitors(competitors);
	};
	render() {
		let competitorDivs = [];
		const { competitors, handleFormChange } = this.props;
		for (let index in competitors) {
			competitorDivs.push(
				<div key={index}>
					<input
						id={index}
						type="text"
						placeholder="Competitor"
						className="strategy-input-theme"
						value={competitors[index]}
						onChange={handleFormChange}
					/>
				</div>
			);
		}
		return (
			<div className="competitor-input">
				{competitorDivs}
				<div className="icon-container">
					<button onClick={() => this.addCompetitor()} className="fa fa-plus fa-2x add-competitor" />
				</div>
			</div>
		);
	}
}
export default CompetitorsTab;
