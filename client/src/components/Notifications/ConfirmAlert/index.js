import React, { Component } from "react";
import "./styles/";

class ConfirmAlert extends Component {
	render() {
		return (
			<div className="confirm-alert-background" onClick={this.props.close}>
				<div className="confirm-alert">
					<div className="confirm-title">{this.props.title}</div>
					<div className="confirm-message">{this.props.message}</div>
					<div className="options-container">
						<button onClick={() => this.props.callback(true)} className="confirm-button">
							Delete
						</button>
						<button onClick={() => this.props.callback(false)} className="cancel-button">
							Cancel
						</button>
					</div>
				</div>
			</div>
		);
	}
}
export default ConfirmAlert;
