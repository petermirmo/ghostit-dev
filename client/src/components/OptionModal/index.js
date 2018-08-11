import React, { Component } from "react";

import "./styles/";

class OptionModal extends Component {
	render() {
		return (
			<div className="modal" onClick={() => this.props.handleChange(false, "optionModal")}>
				<div className="option-container">
					<div
						className="option1"
						onClick={e => {
							e.stopPropagation();
							this.props.handleChange(true, "campaignModal");
							this.props.handleChange(false, "optionModal");
						}}
					>
						Create a Campaign
					</div>
					<div
						className="option2"
						onClick={e => {
							e.stopPropagation();
							this.props.handleChange(true, "contentModal");
							this.props.handleChange(false, "optionModal");
						}}
					>
						Create a single post
					</div>
				</div>
			</div>
		);
	}
}
export default OptionModal;
