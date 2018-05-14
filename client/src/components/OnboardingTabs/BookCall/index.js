import React, { Component } from "react";

import "./style.css";

class BookCall extends Component {
	constructor(props) {
		super(props);
		props.setHeaderMessage(props.title);
	}
	render() {
		const { className, value, link } = this.props;
		return (
			<form action={link}>
				<button className={className}>{value}</button>
			</form>
		);
	}
}
export default BookCall;
