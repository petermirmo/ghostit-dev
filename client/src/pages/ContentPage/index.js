import React, { Component } from "react";

import Calendar from "./Calendar";

class Content extends Component {
	state = {
		newClient: true
	};
	render() {
		return (
			<div id="wrapper">
				<Calendar />
			</div>
		);
	}
}
export default Content;
