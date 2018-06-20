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

		if (!this.wrapperRef.contains(event.target)) return;

		this.props.something(false);
	};

	render() {
		return (
			<div className="modal" ref={this.setWrapperRef}>
				hello
			</div>
		);
	}
}
export default OptionModal;
