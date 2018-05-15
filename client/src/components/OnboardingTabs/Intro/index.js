import React, { Component } from "react";

import "./style.css";

class IntroTab extends Component {
	constructor(props) {
		super(props);
		props.setHeaderMessage(props.title);
	}
	render() {
		const { className } = this.props;
		return (
			<p className={className}>
				Great content does not write itself! We need to know as much about your business and brand as you can tell us.
				Please fill out this questionairre with as much information as possible. After you fill it out we will do our
				own research and add to it!
			</p>
		);
	}
}
export default IntroTab;
