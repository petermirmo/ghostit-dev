import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import UserAttribute from "./UserAttributeDiv";

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
		this.keyDownTextField = this.keyDownTextField.bind(this);
		this.cancel = this.cancel.bind(this);
		this.saveUser = this.saveUser.bind(this);

		document.addEventListener("keydown", this.keyDownTextField, false);
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
	keyDownTextField(e) {
		var keyCode = e.keyCode;
		// Keycode 65-90 are letters, keycode 8 is a backspace, keycode 191 is a forward slash
		if ((keyCode < 65 || keyCode > 90) && (keyCode !== 8 && keyCode !== 191)) return;

		let timezoneSearch = this.state.timezoneSearch;
		if (keyCode === 8) {
			timezoneSearch = timezoneSearch.substring(0, timezoneSearch.length - 1);
		} else if (keyCode === 191) {
			timezoneSearch += "/";
		} else {
			timezoneSearch += String.fromCharCode(keyCode);
		}
		timezoneSearch = timezoneSearch.toLowerCase();

		this.setState({ timezoneSearch: timezoneSearch });
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
		let showCancelButton;
		let showSaveButton;
		let showEditButton;
		if (this.state.editUser) {
			showCancelButton = { display: "inline-block" };
			showSaveButton = { display: "inline-block" };
			showEditButton = { display: "none" };
		} else {
			showCancelButton = { display: "none" };
			showSaveButton = { display: "none" };
			showEditButton = { display: "inline-block" };
		}
		let userAttributes = [];
		let booleanTest = false;
		let userButtons;
		for (var index in this.props.user) {
			let dropdownList = [];
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
				dropdownList = ["demo", "client", "manager", "admin"];
			} else if (index === "writer") {
				dropdownList = this.props.managers;
			}
			let value = this.props.user[index];
			if (value.name) {
				value = value.name;
			}
			if (index !== "signedInAsUser") {
				userAttributes.push(
					<UserAttribute
						key={index}
						value={value}
						label={index}
						editUser={
							this.state.editUser && index !== "password" && index !== "__v" && index !== "_id" && index !== "password"
						}
						dropdown={dropdownList.length !== 0}
						dropdownList={dropdownList}
						updateParentState={this.updateUser}
					/>
				);
			}
			booleanTest = true;
		}
		if (booleanTest) {
			userButtons = (
				<div>
					<button
						id="editUserButton"
						onClick={this.editUser}
						className="fa fa-edit fa-2x margin-auto center"
						style={showEditButton}
					/>

					<button
						id="saveButton"
						onClick={this.saveUser}
						className="fa fa-check fa-2x margin-auto center"
						style={showSaveButton}
					/>
					<button
						id="cancelButton"
						onClick={this.cancel}
						className="fa fa-times fa-2x margin-auto center"
						style={showCancelButton}
					/>
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
