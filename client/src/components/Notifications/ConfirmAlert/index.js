import React, { Component } from "react";
import "./styles/";

class ConfirmAlert extends Component {
	render() {
		return (
			<div className="confirm-alert-background" onClick={this.props.close}>
				<div className="confirm-alert" onClick={e => e.stopPropagation()}>
					<div className="confirm-title">{this.props.title}</div>
					<div className="confirm-message">{this.props.message}</div>
					<div className="options-container">
						<button
							onClick={() => this.props.callback(true)}
							className={this.props.modify ? "cancel-button" : "confirm-button"}
						>
							{this.props.modify ? "Modify" : "Delete"}
						</button>
						<button
							onClick={() => this.props.callback(false)}
							className={this.props.modify ? "confirm-button" : "cancel-button"}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		);
	}
}
export default ConfirmAlert;
