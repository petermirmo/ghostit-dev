import React, { Component } from "react";

import "./style.css";

class Notification extends Component {
	render() {
		const { title, message, notificationType } = this.props;

		return (
			<div className={"notification " + notificationType}>
				<span className="closebtn" onClick={this.props.callback}>
					&times;
				</span>
				<h4 className="notifcation-title">{title}</h4>
				{message}
			</div>
		);
	}
}
export default Notification;
