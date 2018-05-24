import React, { Component } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class WritersBriefForm extends Component {
	state = this.props.writersBrief;
	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.writersBrief);
	}
	handleChange = () => {};
	handleDateChange = date => {
		this.setState({ cycleStartDate: date });
	};
	render() {
		let { cycleStartDate } = this.state;

		return (
			<div>
				<p className="something">Content cycle start: </p>
				<p className="something">Content cycle end: </p>
				<DatePicker
					className="test center"
					selected={cycleStartDate}
					onChange={this.handleDateChange}
					dateFormat="MMMM Do YYYY"
				/>

				<p className="something">Content cycle end: </p>
			</div>
		);
	}
}

export default WritersBriefForm;
