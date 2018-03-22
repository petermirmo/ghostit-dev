import React, { Component } from "react";
import axios from "axios";

import UserAttribute from "./UserAttributeDiv";

class UserDiv extends Component {
	constructor(props) {
		super(props);

		this.showPasswordField = this.showPasswordField.bind(this);
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
	render() {
		let userAttributes = [];
		let booleanTest = false;
		let userButtons;
		for (var index in this.props.user) {
			userAttributes.push(<UserAttribute key={index} value={this.props.user[index]} label={index} />);
			booleanTest = true;
		}
		if (booleanTest) {
			userButtons = (
				<div className="test">
					<input
						id="passwordInput"
						type="password"
						name="test"
						placeholder="Please enter your password"
						className="password-input"
					/>
					<button onClick={this.showPasswordField} className="fa fa-sign-in fa-2x float-right center" />
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
