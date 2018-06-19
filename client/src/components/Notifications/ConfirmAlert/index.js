import React, { Component } from "react";
import "./styles/";

class ConfirmAlert extends Component {
	render() {
		return (
			<div className="confirm-alert-background">
				<div className="confirm-alert">
					<strong className="confirm-title">{this.props.title}</strong>
					<div className="confirm-message">{this.props.message}</div>
					<button onClick={() => this.props.callback(true)} className="confirm-button">
						Delete
					</button>
					<button onClick={() => this.props.callback(false)} className="cancel-button">
						Cancel
					</button>
				</div>
			</div>
		);
	}
}
export default ConfirmAlert;
