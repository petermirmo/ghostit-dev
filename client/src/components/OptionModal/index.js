import React, { Component } from "react";

import "./styles/";

class OptionModal extends Component {
	componentDidMount() {
		document.addEventListener("mousedown", this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
	}
	setWrapperRef = node => {
		this.wrapperRef = node;
	};

	handleClickOutside = event => {
		if (!this.wrapperRef) return;

		if (this.wrapperRef.contains(event.target)) return;

		this.props.handleChange(false, "optionModal");
	};

	render() {
		return (
			<div className="modal">
				<div ref={this.setWrapperRef} className="option-container">
					<div
						className="option1"
						onClick={() => {
							this.props.handleChange(true, "campaignModal");
							this.props.handleChange(false, "optionModal");
						}}
					>
						Create a Campaign
					</div>
					<div
						className="option2"
						onClick={() => {
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
