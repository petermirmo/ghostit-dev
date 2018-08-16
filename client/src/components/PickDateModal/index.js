import React, { Component } from "react";
import moment from "moment-timezone";

import DateTimePicker from "../DateTimePicker";

import "./styles/";

class PickDateModal extends Component {
	render() {
		return (
			<div
				className="date-modal-container"
				style={{ top: this.props.clientY, left: this.props.clientX }}
				onClick={e => {
					e.stopPropagation();
				}}
			>
				<div className="label">Campaign Start Day </div>
				<DateTimePicker
					date={this.props.startDate}
					dateFormat="MMMM Do YYYY"
					handleChange={date => this.props.callback(date)}
					dateLowerBound={new moment()}
					disableTime={true}
				/>
			</div>
		);
	}
}

export default PickDateModal;
