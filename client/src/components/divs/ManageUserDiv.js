import React, { Component } from "react";

import UserAttribute from "./UserAttributeDiv";

class UserDiv extends Component {
	render() {
		let userAttributes = [];
		for (var index in this.props.user) {
			userAttributes.push(<UserAttribute key={index} value={this.props.user[index]} label={index} />);
		}

		return <div className="clicked-user-options">{userAttributes}</div>;
	}
}
export default UserDiv;
