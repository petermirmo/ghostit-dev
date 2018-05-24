import React, { Component } from "react";

import { connect } from "react-redux";

import "./style.css";

class WritersBrief extends Component {
	createNewWritersBrief = () => {
		console.log("here ");
	};
	render() {
		const { user } = this.props;
		const adminOrManager = user.role === "admin" || user.role === "manager";

		return (
			<div id="wrapper">
				{adminOrManager && (
					<button className="new-writers-brief" onClick={() => this.createNewWritersBrief()}>
						hello
					</button>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { user: state.user };
}

export default connect(mapStateToProps)(WritersBrief);
