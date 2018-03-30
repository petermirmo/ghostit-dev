import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import UserNotEditableAttribute from "./UserNotEditableAttribute";
import UserEditableAttribute from "./UserEditableAttribute";
import UserDropdownAttribute from "./UserDropdownAttribute";

class UserDiv extends Component {
	state = {
		editUser: false,
		updatedUser: {},
		timezoneSearch: ""
	};
	constructor(props) {
		super(props);

		this.editUser = this.editUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.cancel = this.cancel.bind(this);
		this.saveUser = this.saveUser.bind(this);
	}

	editUser() {
		this.setState({ editUser: !this.state.editUser });
	}
	updateUser(index, value, value2) {
		let user = this.props.user;
		if (index === "writer") {
			user[index] = { id: value, name: value2 };
		} else {
			user[index] = value;
		}
		this.setState({ updateUser: user });
	}

	cancel() {
		this.setState({ editUser: false, signingIntoUser: false });
	}
	saveUser() {
		if (!this.state.updateUser) {
			alert("You have not editted this user!");
			return;
		}
		axios.post("/api/updateUser", this.state.updateUser).then(res => {
			if (res.data) {
				this.props.updateUsers();
				this.cancel();
			} else {
				alert(
					"There has been an error! :( Contact your local dev team immediately! If you do not have a local dev team, you can contact me at peter.mirmotahari@gmail.com!"
				);
			}
		});
	}
	render() {
		let userAttributes = [];
		let booleanTest = false;
		let userButtons;
		for (var index in this.props.user) {
			let dropdownList = [];

			// Timezone dropdown list
			if (index === "timezone") {
				let timezones = moment.tz.names();
				for (var j in timezones) {
					let timezone = timezones[j];
					timezone = timezone.toLowerCase();
					if (timezone.includes(this.state.timezoneSearch)) {
						dropdownList.push(timezones[j]);
					}
				}
			} else if (index === "role") {
				// Role dropdown list
				dropdownList = ["demo", "client", "manager", "admin"];
			} else if (index === "writer") {
				dropdownList = this.props.managers;
			}

			// If it is an object get name in object
			let value = this.props.user[index];
			if (value.name) {
				value = value.name;
			}
			if (index !== "signedInAsUser") {
				if (
					this.state.editUser &&
					index !== "password" &&
					index !== "__v" &&
					index !== "_id" &&
					dropdownList.length === 0
				) {
					userAttributes.push(
						<UserEditableAttribute key={index} value={value} label={index} updateParentState={this.updateUser} />
					);
				} else if (
					this.state.editUser &&
					index !== "password" &&
					index !== "__v" &&
					index !== "_id" &&
					dropdownList.length !== 0
				) {
					userAttributes.push(
						<UserDropdownAttribute
							key={index}
							value={value}
							label={index}
							editUser={this.state.editUser && index !== "password" && index !== "__v" && index !== "_id"}
							dropdownList={dropdownList}
							updateParentState={this.updateUser}
						/>
					);
				} else {
					userAttributes.push(<UserNotEditableAttribute key={index} value={value} label={index} />);
				}
			}
			booleanTest = true;
		}
		if (booleanTest) {
			userButtons = (
				<div>
					{!this.state.editUser && (
						<button id="editUserButton" onClick={this.editUser} className="fa fa-edit fa-2x margin-auto center" />
					)}

					{this.state.editUser && (
						<button id="saveButton" onClick={this.saveUser} className="fa fa-check fa-2x margin-auto center" />
					)}
					{this.state.editUser && (
						<button id="cancelButton" onClick={this.cancel} className="fa fa-times fa-2x margin-auto center" />
					)}
				</div>
			);
		}

		return (
			<div className="clicked-user-options">
				{userAttributes}
				{userButtons}
			</div>
		);
	}
}
export default UserDiv;
