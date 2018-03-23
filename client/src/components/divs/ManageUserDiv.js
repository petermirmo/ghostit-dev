import React, { Component } from "react";
import axios from "axios";

import UserAttribute from "./UserAttributeDiv";

class UserDiv extends Component {
	state = {
		editUser: false
	};
	constructor(props) {
		super(props);

		this.showPasswordField = this.showPasswordField.bind(this);
		this.editUser = this.editUser.bind(this);
	}
	signInAsUser(password) {
		axios.post("/api/signInAsUser", { password: password }).then(res => {
			console.log(res);
		});
	}
	showPasswordField() {
		// Check if input is displayed
		if (document.getElementById("passwordInput").style.display === "inline-block") {
			// Make sure they have typed in password
			if (document.getElementById("passwordInput").value === "") {
				document.getElementById("passwordInput").style.borderColor = "var(--red-theme-color)";
			} else {
				this.signInAsUser(document.getElementById("passwordInput").value);
			}
		} else {
			document.getElementById("passwordInput").style.display = "inline-block";
		}
	}
	editUser() {
		this.setState({ editUser: !this.state.editUser });
	}
	render() {
		let userAttributes = [];
		let booleanTest = false;
		let userButtons;
		for (var index in this.props.user) {
			userAttributes.push(
				<UserAttribute key={index} value={this.props.user[index]} label={index} editUser={this.state.editUser} />
			);
			booleanTest = true;
		}
		if (booleanTest) {
			userButtons = (
				<div>
					<button onClick={this.editUser} className="fa fa-edit fa-2x margin-auto center" />
					<input
						id="passwordInput"
						type="password"
						name="test"
						placeholder="Please enter your password"
						className="password-input"
					/>
					<button onClick={this.showPasswordField} className="fa fa-sign-in fa-2x margin-auto center" />
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
