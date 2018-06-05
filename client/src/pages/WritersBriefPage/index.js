import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

import { connect } from "react-redux";
import WritersBriefForm from "./WritersBriefForm";
import "./style.css";

class WritersBrief extends Component {
	state = {
		writersBriefs: [],
		activeWritersBriefIndex: undefined
	};

	componentDidMount() {
		this.getWritersBriefs();
		this._ismounted = true;
	}
	componentWillUnmount() {
		this._ismounted = false;
	}

	getWritersBriefs = () => {
		axios.get("api/writersBriefs").then(res => {
			let { writersBriefs, loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			for (let index in writersBriefs) {
				writersBriefs[index].cycleStartDate = new moment(writersBriefs[index].cycleStartDate);
				writersBriefs[index].cycleEndDate = new moment(writersBriefs[index].cycleEndDate);
			}
			writersBriefs.sort(compare);
			let activeWritersBriefIndex;
			if (writersBriefs.length > 0) activeWritersBriefIndex = 0;
			if (this._ismounted) {
				this.setState({ writersBriefs: writersBriefs, activeWritersBriefIndex: activeWritersBriefIndex });
			}
		});
	};
	createNewWritersBrief = () => {
		let { writersBriefs, activeWritersBriefIndex } = this.state;

		let newWritersBrief = {
			cycleStartDate: new moment(),
			cycleEndDate: new moment().add({ months: 1 }),
			socialPostsDescriptions: { facebook: "", instagram: "", twitter: "", linkedin: "" }
		};
		writersBriefs.unshift(newWritersBrief);

		writersBriefs.sort(compare);
		for (let index in writersBriefs) {
			if (writersBriefs[index] === newWritersBrief) {
				activeWritersBriefIndex = index;
			}
		}

		this.setState({ writersBriefs: writersBriefs, activeWritersBriefIndex: activeWritersBriefIndex });
	};
	setWritersBriefActive = activeWritersBriefIndex => {
		this.setState({ activeWritersBriefIndex: activeWritersBriefIndex });
	};
	updateWritersBrief = writersBrief => {
		let { writersBriefs, activeWritersBriefIndex } = this.state;
		writersBriefs[activeWritersBriefIndex] = writersBrief;
		writersBriefs.sort(compare);
		for (let index in writersBriefs) {
			if (writersBriefs[index] === writersBrief) {
				activeWritersBriefIndex = index;
			}
		}
		this.setState({ writersBriefs: writersBriefs, activeWritersBriefIndex: activeWritersBriefIndex });
	};
	render() {
		const { user } = this.props;
		const { writersBriefs, activeWritersBriefIndex } = this.state;

		const adminManagerOrDemo = user.role === "admin" || user.role === "manager" || user.role === "demo";

		let writersBriefsButtons = [];
		let activeWritersBrief = writersBriefs[activeWritersBriefIndex];

		for (let index in writersBriefs) {
			let active;
			if (activeWritersBrief) {
				if (writersBriefs[index].cycleStartDate === activeWritersBrief.cycleStartDate) {
					active = "active";
				}
			}
			writersBriefsButtons.push(
				<button
					key={index}
					className={"writers-brief-button " + active}
					onClick={() => this.setWritersBriefActive(index)}
				>
					{String(writersBriefs[index].cycleStartDate.format("MMMM Do YYYY"))}
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
					{writersBriefsButtons}
				</div>
				{activeWritersBrief && (
					<WritersBriefForm writersBrief={activeWritersBrief} updateWritersBrief={this.updateWritersBrief} />
				)}
			</div>
		);
	}
}

function compare(a, b) {
	if (a.cycleStartDate < b.cycleStartDate) return 1;
	if (a.cycleStartDate > b.cycleStartDate) return -1;
	return 0;
}

function mapStateToProps(state) {
	return { user: state.user };
}

export default connect(mapStateToProps)(WritersBrief);
