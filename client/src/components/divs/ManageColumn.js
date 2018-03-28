import React, { Component } from "react";

class ManageColumn extends Component {
	render() {
		var userDiv = [];

		// User list is sent by parent in props
		// Loop through and create a row for each user
		for (var index in this.props.users) {
			userDiv.push(
				<p id={index} key={index} className="user-row center" onClick={this.props.userClicked}>
					{this.props.users[index].fullName}
				</p>
			);
		}
		return (
			<div className="user-column" style={this.props.styleOverride}>
				<textarea onKeyUp={this.props.searchUsers} placeholder="Search users" className="search center" rows={1} />
				{userDiv}
			</div>
		);
	}
}
export default ManageColumn;
