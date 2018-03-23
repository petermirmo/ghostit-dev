import React, { Component } from "react";

class UserAttribute extends Component {
	render() {
		let userAttributeDiv;
		if (this.props.editUser) {
			userAttributeDiv = (
				<div style={{ overflow: "hidden" }}>
					<h4 className="user-attribute-label">{this.props.label + ":"}</h4>
					<span id="test" className="center">
						<textarea className="user-attribute-edit" rows={1}>
							{this.props.value}
						</textarea>
					</span>
				</div>
			);
		} else {
			userAttributeDiv = (
				<div>
					<h4 className="user-attribute-label">{this.props.label + ":"}</h4>
					<p className="user-attribute">{this.props.value}</p>
				</div>
			);
		}
		return <div>{userAttributeDiv}</div>;
	}
}
export default UserAttribute;
