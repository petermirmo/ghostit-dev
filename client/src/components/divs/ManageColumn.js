import React, { Component } from "react";
import "../../css/UsersTable.css";

class ManageColumn extends Component {
	render() {
		var userDiv = [];
		// User list is sent by parent in props
		// Loop through and create a row for each user
		for (var index in this.props.users) {
			userDiv.push(
				<p key={index} className="user-row center">
					{this.props.users[index].fullName}
				</p>
			);
		}
		return <div className="user-column">{userDiv}</div>;
	}
}
export default ManageColumn;
