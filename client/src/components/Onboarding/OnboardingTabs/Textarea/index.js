import React, { Component } from "react";

class TextareaTab extends Component {
	constructor(props) {
		super(props);
		props.setHeaderMessage(props.title);
	}
	render() {
		const { handleChange, placeholder, className, value, index } = this.props;
		return (
			<textarea
				type="text"
				placeholder={placeholder}
				className={className}
				value={value}
				onChange={event => handleChange(index, event.target.value)}
			/>
		);
	}
}
export default TextareaTab;
