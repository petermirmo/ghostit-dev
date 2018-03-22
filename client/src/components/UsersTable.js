import React, { Component } from "react";
import axios from "axios";

import "../css/UsersTable.css";
import ManageColumn from "./divs/ManageColumn";
import NavBar from "./NavBar";

class UsersTable extends Component {
	state = {
		demoUsers: [],
		payingUsers: [],
		writerUsers: [],
		adminUsers: [],
		activeTab: "",
		activeUsers: [],
		untouchedActiveUsers: []
	};
	constructor(props) {
		super(props);

		this.updateUsers = this.updateUsers.bind(this);
		this.getUsers = this.getUsers.bind(this);
		this.searchUsers = this.searchUsers.bind(this);

		this.getUsers();
	}
	getUsers() {
		axios.get("/api/users").then(res => {
			if (!res) {
				// If res sends back false the user is not an admin and is likely a hacker
				window.location.replace("/content");
			} else {
				var users = res.data;

				var demoUsers = [];
				var payingUsers = [];
				var writerUsers = [];
				var adminUsers = [];

				for (var index in users) {
					if (users[index].role === "demo") {
						demoUsers.push(users[index]);
					} else if (users[index].role === "client") {
						payingUsers.push(users[index]);
					} else if (users[index].role === "manager") {
						writerUsers.push(users[index]);
					} else if (users[index].role === "admin") {
						adminUsers.push(users[index]);
					}
				}
				this.setState({
					demoUsers: demoUsers,
					payingUsers: payingUsers,
					writerUsers: writerUsers,
					adminUsers: adminUsers
				});
			}
		});
	}
	updateUsers(event) {
		// Remove active class from last tab
		if (this.state.activeTab) {
			document.getElementById(this.state.activeTab).className = "";
		}
		event.target.className = "active";
		let users;
		if (event.target.id === "admin") {
			users = this.state.adminUsers;
		} else if (event.target.id === "writer") {
			users = this.state.writerUsers;
		} else if (event.target.id === "client") {
			users = this.state.payingUsers;
		} else if (event.target.id === "demo") {
			users = this.state.demoUsers;
		}
		this.setState({ activeTab: event.target.id, activeUsers: users, untouchedActiveUsers: users });
	}
	searchUsers(event) {
		let value = event.target.value;
		let stringArray = value.split(" ");

		let users = [];
		// Loop through all users
		for (var index in this.state.untouchedActiveUsers) {
			let matchFound = false;
			// Loop through all words in the entered value
			for (var j in stringArray) {
				// Make sure we are not checking an empty string
				if (stringArray[j] !== "") {
					// Check to see if a part of the string matches user's fullName or email
					if (
						this.state.untouchedActiveUsers[index].fullName.includes(stringArray[j]) ||
						this.state.untouchedActiveUsers[index].email.includes(stringArray[j])
					) {
						matchFound = true;
					}
				}
			}
			if (matchFound) {
				users.push(this.state.untouchedActiveUsers[index]);
			}
		}
		this.setState({ activeUsers: users });
	}
	render() {
		return (
			<div>
				<NavBar updateParentState={this.updateUsers} categories={["admin", "writer", "client", "demo"]} />
				<ManageColumn users={this.state.activeUsers} searchUsers={this.searchUsers} />
			</div>
		);
	}
}

export default UsersTable;
