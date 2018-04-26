import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";

import ManageColumn from "../../components/SearchColumn/";
import ObjectEditTable from "../../components/ObjectEditTable/";
import NavigationBar from "../../components/NavigationBar/";
import { nonEditableUserFields, canShowUserFields } from "../../constants/Common";

class UsersTable extends Component {
	state = {
		demoUsers: [],
		clientUsers: [],
		managerUsers: [],
		adminUsers: [],
		activeTab: "demo",
		activeUsers: [],
		untouchedActiveUsers: [],
		clickedUser: undefined,
		editting: false,
		plans: undefined
	};
	constructor(props) {
		super(props);

		this.updateUsers = this.updateUsers.bind(this);
		this.getUsers = this.getUsers.bind(this);
		this.searchUsers = this.searchUsers.bind(this);
		this.handleClickedUser = this.handleClickedUser.bind(this);
		this.saveUser = this.saveUser.bind(this);
		this.editObject = this.editObject.bind(this);

		this.getUsers();
		this.getPlans();
	}
	getUsers() {
		axios.get("/api/users").then(res => {
			if (!res) {
				// If res sends back false the user is not an admin and is likely a hacker
				window.location.replace("/content");
			} else {
				var users = res.data;

				var demoUsers = [];
				var clientUsers = [];
				var managerUsers = [];
				var adminUsers = [];

				for (var index in users) {
					if (users[index].role === "demo") {
						demoUsers.push(users[index]);
					} else if (users[index].role === "client") {
						clientUsers.push(users[index]);
					} else if (users[index].role === "manager") {
						managerUsers.push(users[index]);
					} else if (users[index].role === "admin") {
						adminUsers.push(users[index]);
					}
				}
				let activeUsers;
				if (this.state.activeTab === "demo") {
					activeUsers = demoUsers;
				} else if (this.state.activeTab === "client") {
					activeUsers = clientUsers;
				} else if (this.state.activeTab === "manager") {
					activeUsers = managerUsers;
				} else if (this.state.activeTab === "admin") {
					activeUsers = adminUsers;
				}

				this.setState({
					demoUsers: demoUsers,
					clientUsers: clientUsers,
					managerUsers: managerUsers,
					adminUsers: adminUsers,
					activeUsers: activeUsers,
					untouchedActiveUsers: activeUsers
				});
			}
		});
	}
	getPlans = () => {
		axios.get("/api/plans").then(res => {
			this.setState({ plans: res.data });
		});
	};
	updateUsers(event) {
		// Remove active class from last tab
		if (this.state.activeTab) {
			document.getElementById(this.state.activeTab).className = "";
		}
		event.target.className = "active";
		let users;
		if (event.target.id === "admin") {
			users = this.state.adminUsers;
		} else if (event.target.id === "manager") {
			users = this.state.managerUsers;
		} else if (event.target.id === "client") {
			users = this.state.clientUsers;
		} else if (event.target.id === "demo") {
			users = this.state.demoUsers;
		}
		this.setState({ activeTab: event.target.id, activeUsers: users, untouchedActiveUsers: users });
	}
	searchUsers(event) {
		let value = event.target.value;
		if (value === "") {
			this.setState({ activeUsers: this.state.untouchedActiveUsers });
			return;
		}
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
	handleClickedUser(event) {
		// ID of clicked event is the index of in activeUsers of the clicked user
		const temp = this.state.activeUsers[event.target.id];
		this.setState({ clickedUser: temp, editting: false });
	}
	saveUser(user) {
		axios.post("/api/updateUser", user).then(res => {
			if (res.data) {
				alert("success");
				this.getUsers();
			} else {
				alert(
					"There has been an error! :( Contact your local dev team immediately! If you do not have a local dev team, you can contact me at peter.mirmotahari@gmail.com!"
				);
			}
		});
	}
	editObject() {
		this.setState({ editting: !this.state.editting });
	}
	render() {
		let array = [];

		for (let index in this.state.clickedUser) {
			let canEdit = true;
			let dropdown = false;
			let dropdownList;
			if (nonEditableUserFields.indexOf(index) !== -1) {
				canEdit = false;
			} else if (index === "role" || index === "timezone" || index === "writer" || index === "plan") {
				dropdown = true;
				if (index === "role") {
					dropdownList = ["demo", "client", "manager", "admin"];
				} else if (index === "timezone") {
					dropdownList = moment.tz.names();
				} else if (index === "writer") {
					dropdownList = [];
					for (let j in this.state.managerUsers) {
						dropdownList.push({
							id: this.state.managerUsers[j]._id,
							value: this.state.managerUsers[j].fullName
						});
					}
				} else if (index === "plan") {
					dropdownList = [];
					for (let j in this.state.plans) {
						dropdownList.push({
							id: this.state.plans[j]._id,
							value: this.state.plans[j].name
						});
					}
				}
			}

			if (canShowUserFields.indexOf(index) === -1) {
				array.push({
					canEdit: canEdit,
					value:
						this.state.clickedUser[index] === Object(this.state.clickedUser[index])
							? this.state.clickedUser[index].name
							: this.state.clickedUser[index],
					dropdown: dropdown,
					dropdownList: dropdownList,
					index: index
				});
			}
		}
		return (
			<div>
				<NavigationBar
					updateParentState={this.updateUsers}
					categories={["admin", "manager", "client", "demo"]}
					setActive={this.state.activeTab}
				/>
				<ManageColumn
					objectList={this.state.activeUsers}
					searchObjects={this.searchUsers}
					handleClickedObject={this.handleClickedUser}
				/>
				<div style={{ float: "right", width: "74%" }}>
					<ObjectEditTable
						objectArray={array}
						updateList={this.getUsers}
						saveObject={this.saveUser}
						clickedObject={this.state.clickedUser}
						className="center"
						editting={this.state.editting}
						editObject={this.editObject}
					/>
				</div>
			</div>
		);
	}
}

export default UsersTable;
