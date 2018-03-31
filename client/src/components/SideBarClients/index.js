import React, { Component } from "react";
import axios from "axios";
import ManageColumn from "../SearchColumn/";
import "../../css/sideBar.css";

class ConnectAccountsSideBar extends Component {
	state = {
		clients: [],
		untouchedClients: []
	};
	constructor(props) {
		super(props);
		this.getMyClients = this.getMyClients.bind(this);
		this.searchUsers = this.searchUsers.bind(this);
		this.userClicked = this.userClicked.bind(this);
		this.getMyClients();
	}
	getMyClients() {
		axios.get("/api/clients").then(res => {
			if (Array.isArray(res.data)) {
				this.setState({ clients: res.data, untouchedClients: res.data });
			} else {
				// To Do: handle error
			}
		});
	}
	searchUsers(event) {
		let value = event.target.value;
		if (value === "") {
			this.setState({ activeUsers: this.state.untouchedClients });
			return;
		}
		let stringArray = value.split(" ");

		let users = [];
		// Loop through all users
		for (var index in this.state.untouchedClients) {
			let matchFound = false;
			// Loop through all words in the entered value
			for (var j in stringArray) {
				// Make sure we are not checking an empty string
				if (stringArray[j] !== "") {
					// Check to see if a part of the string matches user's fullName or email
					if (
						this.state.untouchedClients[index].fullName.includes(stringArray[j]) ||
						this.state.untouchedClients[index].email.includes(stringArray[j])
					) {
						matchFound = true;
					}
				}
			}
			if (matchFound) {
				users.push(this.state.untouchedClients[index]);
			}
		}
		this.setState({ clients: users });
	}
	userClicked(event) {
		// ID of clicked event is the index of in activeUsers of the clicked user
		const temp = this.state.clients[event.target.id];
		this.setState({ clickedUser: temp });
		axios.post("/api/signInAsUser", temp).then(res => {
			if (res.data) {
				window.location.reload();
			} else {
				// To Do: handle error
			}
		});
	}
	render() {
		return (
			<div className="side-bar animate-left" style={{ display: "none" }} id="clientsSideBar">
				<ManageColumn
					users={this.state.clients}
					searchUsers={this.searchUsers}
					userClicked={this.userClicked}
					styleOverride={{ width: "90%" }}
				/>
			</div>
		);
	}
}

export default ConnectAccountsSideBar;
