import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import UserAttribute from "./UserAttributeDiv";

class UserDiv extends Component {
	state = {
		editUser: false,
		updatedUser: {},
		timezoneSearch: "",
		signingIntoUser: false
	};
	constructor(props) {
		super(props);

		this.showPasswordField = this.showPasswordField.bind(this);
		this.editUser = this.editUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.keyDownTextField = this.keyDownTextField.bind(this);
		this.cancel = this.cancel.bind(this);
		this.saveUser = this.saveUser.bind(this);

		document.addEventListener("keydown", this.keyDownTextField, false);
	}
	signInAsUser(password) {
		axios.post("/api/signInAsUser", { password: password }).then(res => {
			console.log(res);
		});
	}
	showPasswordField() {
		// Check if input is displayed
		if (this.state.signingIntoUser) {
			// Make sure they have typed in password
			if (document.getElementById("passwordInput").value === "") {
				document.getElementById("passwordInput").style.borderColor = "var(--red-theme-color)";
			} else {
				document.getElementById("passwordInput").style.borderColor = "var(--purple-theme-color)";
				this.signInAsUser(document.getElementById("passwordInput").value);
			}
		} else {
			this.setState({ signingIntoUser: true });
		}
	}
	editUser() {
		this.setState({ editUser: !this.state.editUser });
	}
	updateUser(index, value) {
		let user = this.props.user;
		user[index] = value;
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
			console.log(res);
		});
	}
	render() {
		let showCancelButton;
		let showSaveButton;
		let showEditButton;
		let showLoginButton;
		let showPasswordInput;
		if (this.state.editUser || this.state.signingIntoUser) {
			if (this.state.editUser && !this.state.signingIntoUser) {
				showCancelButton = { display: "inline-block" };
				showSaveButton = { display: "inline-block" };
				showEditButton = { display: "none" };
				showLoginButton = { display: "none" };
				showPasswordInput = { display: "none" };
			} else if (!this.state.editUser && this.state.signingIntoUser) {
				showCancelButton = { display: "inline-block" };
				showSaveButton = { display: "none" };
				showEditButton = { display: "none" };
				showLoginButton = { display: "inline-block" };
				showPasswordInput = { display: "inline-block" };
			}
		} else {
			showCancelButton = { display: "none" };
			showSaveButton = { display: "none" };
			showEditButton = { display: "inline-block" };
			showLoginButton = { display: "inline-block" };
			showPasswordInput = { display: "none" };
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
			}
			userAttributes.push(
				<UserAttribute
					key={index}
					value={this.props.user[index]}
					label={index}
					editUser={
						this.state.editUser && index !== "password" && index !== "__v" && index !== "_id" && index !== "password"
					}
					dropdown={index === "timezone" || index === "role"}
					dropdownList={dropdownList}
					updateParentState={this.updateUser}
				/>
			);
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

					<input
						id="passwordInput"
						type="password"
						placeholder="Please enter your password"
						className="password-input"
						style={showPasswordInput}
					/>
					<button
						id="signInToUserButton"
						onClick={this.showPasswordField}
						className="fa fa-sign-in fa-2x margin-auto center"
						style={showLoginButton}
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
