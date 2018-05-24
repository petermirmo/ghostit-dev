import React, { Component } from "react";
import moment from "moment";

import { connect } from "react-redux";
import WritersBriefForm from "./WritersBriefForm";
import "./style.css";

class WritersBrief extends Component {
	state = {
		pastWritersBriefs: [],
		writersBrief: { cycleStartDate: new moment() }
	};
	createNewWritersBrief = () => {
		let { pastWritersBriefs } = this.state;
		let date = new moment();
		pastWritersBriefs.unshift({ cycleStartDate: date });

		this.setState({ pastWritersBriefs: pastWritersBriefs });
	};
	setWritersBriefActive = writersBrief => {
		this.setState({ writersBrief: writersBrief });
	};
	render() {
		const { user } = this.props;
		const { pastWritersBriefs, writersBrief } = this.state;
		const adminManagerOrDemo = user.role === "admin" || user.role === "manager" || user.role === "demo";

		let pastWritersBriefsButtons = [];
		for (let index in pastWritersBriefs) {
			let active;
			if (pastWritersBriefs[index].cycleStartDate === writersBrief.cycleStartDate) active = "active";
			pastWritersBriefsButtons.push(
				<button
					key={index}
					className={"writers-brief-button " + active}
					onClick={() => this.setWritersBriefActive(pastWritersBriefs[index])}
				>
					{String(pastWritersBriefs[index].cycleStartDate.format("MMMM Do YYYY"))}
				</button>
			);
		}

		return (
			<div id="wrapper">
				<div className="past-writers-brief-container">
					{adminManagerOrDemo && (
						<button className="new-writers-brief" onClick={() => this.createNewWritersBrief()}>
							<span className="fa fa-plus" /> New Writers Brief
						</button>
					)}
					{pastWritersBriefsButtons}
				</div>
				{writersBrief.cycleStartDate && <WritersBriefForm writersBrief={writersBrief} />}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { user: state.user };
}

export default connect(mapStateToProps)(WritersBrief);
