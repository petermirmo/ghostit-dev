import React, { Component } from "react";

class UserAttribute extends Component {
	render() {
		return (
			<div>
				<h4 className="user-attribute-label">{this.props.label + ":"}</h4>
				<p className="user-attribute">{this.props.value}</p>
			</div>
		);
	}
}
export default UserAttribute;
