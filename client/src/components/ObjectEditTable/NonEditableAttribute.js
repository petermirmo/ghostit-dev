import React, { Component } from "react";

class UserAttribute extends Component {
	render() {
		return (
			<div className="row">
				<span className="user-attribute-label">
					<h4>{this.props.label + ":"}</h4>
					<p className="user-attribute">{this.props.value}</p>
				</span>
			</div>
		);
	}
}
export default UserAttribute;
