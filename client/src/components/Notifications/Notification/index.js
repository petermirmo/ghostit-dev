import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import "./styles/";

class Notification extends Component {
	render() {
		const { title, message, notificationType } = this.props;

		return (
			<div className={"notification " + notificationType}>
				<FontAwesomeIcon icon={faTimes} className="closebtn" onClick={this.props.callback} />
				<h4 className="notifcation-title">{title}</h4>
				{message}
			</div>
		);
	}
}
export default Notification;
