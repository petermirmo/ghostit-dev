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
		activeTab: ""
	};
	constructor(props) {
		super(props);

		this.updateUsers = this.updateUsers.bind(this);
		this.getUsers = this.getUsers.bind(this);

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
		this.setState({ activeTab: event.target.id });
	}
	render() {
		let users;
		if (this.state.activeTab === "admin") {
			users = this.state.adminUsers;
		} else if (this.state.activeTab === "writer") {
			users = this.state.writerUsers;
		} else if (this.state.activeTab === "client") {
			users = this.state.payingUsers;
		} else if (this.state.activeTab === "demo") {
			users = this.state.demoUsers;
		}

		return (
			<div>
				<NavBar updateParentState={this.updateUsers} categories={["admin", "writer", "client", "demo"]} />
				<ManageColumn users={users} />
			</div>
		);
	}
}

export default UsersTable;
