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
		activeTab: "client",
		activeUsers: [],
		untouchedActiveUsers: [],
		clickedUser: undefined,
		editting: false,
		plans: undefined,
		userCategories: { admin: false, manager: false, client: true, demo: false }
	};
	constructor(props) {
		super(props);

		this.getUsers();
		this.getPlans();
	}
	getUsers = () => {
		const { activeTab } = this.state;
		axios.get("/api/users").then(res => {
			if (!res) {
				// If res sends back false the user is not an admin and is likely a hacker
				window.location.replace("/content");
			} else {
				let users = res.data;

				let demoUsers = [];
				let clientUsers = [];
				let managerUsers = [];
				let adminUsers = [];

				for (let index in users) {
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
				switch (activeTab) {
					case "demo":
						activeUsers = demoUsers;
						break;
					case "client":
						activeUsers = clientUsers;
						break;
					case "manager":
						activeUsers = managerUsers;
						break;
					case "admin":
						activeUsers = adminUsers;
						break;
					default:
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
	};
	getPlans = () => {
		axios.get("/api/plans").then(res => {
			this.setState({ plans: res.data });
		});
	};
	updateUsers = event => {
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
	};
	searchUsers = event => {
		const { untouchedActiveUsers } = this.state;
		let value = event.target.value;
		if (value === "") {
			this.setState({ activeUsers: untouchedActiveUsers });
			return;
		}
		let stringArray = value.split(" ");

		let users = [];
		// Loop through all users
		for (var index in untouchedActiveUsers) {
			let matchFound = false;
			// Loop through all words in the entered value
			for (var j in stringArray) {
				// Make sure we are not checking an empty string
				if (stringArray[j] !== "") {
					// Check to see if a part of the string matches user's fullName or email
					if (
						untouchedActiveUsers[index].fullName.includes(stringArray[j]) ||
						untouchedActiveUsers[index].email.includes(stringArray[j])
					) {
						matchFound = true;
					}
				}
			}
			if (matchFound) {
				users.push(untouchedActiveUsers[index]);
			}
		}
		this.setState({ activeUsers: users });
	};
	handleClickedUser = event => {
		// ID of clicked event is the index of in activeUsers of the clicked user
		const temp = this.state.activeUsers[event.target.id];
		this.setState({ clickedUser: temp, editting: false });
	};
	saveUser = user => {
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
	};
	editObject = () => {
		this.setState({ editting: !this.state.editting });
	};
	render() {
		const { clickedUser, managerUsers, plans, activeTab, editting, activeUsers, userCategories } = this.state;
		let objectArry = [];

		for (let index in clickedUser) {
			let canEdit = true;
			let dropdown = false;
			let dropdownList = [];
			if (nonEditableUserFields.indexOf(index) !== -1) {
				canEdit = false;
			} else if (index === "role" || index === "timezone" || index === "writer" || index === "plan") {
				dropdown = true;

				if (index === "role") {
					dropdownList = ["demo", "client", "manager", "admin"];
				} else if (index === "timezone") {
					dropdownList = moment.tz.names();
				} else if (index === "writer") {
					for (let j in managerUsers) {
						dropdownList.push({
							id: managerUsers[j]._id,
							value: managerUsers[j].fullName
						});
					}
				} else if (index === "plan") {
					for (let j in plans) {
						dropdownList.push({
							id: plans[j]._id,
							value: plans[j].name
						});
					}
				}
			}

			if (canShowUserFields.indexOf(index) === -1) {
				objectArry.push({
					canEdit: canEdit,
					value:
						this.state.clickedUser[index] === Object(clickedUser[index])
							? clickedUser[index].name ? clickedUser[index].name : clickedUser[index].id
							: clickedUser[index],
					dropdown: dropdown,
					dropdownList: dropdownList,
					index: index
				});
			}
		}
		return (
			<div>
				<NavigationBar updateParentState={this.updateUsers} categories={userCategories} setActive={activeTab} />
				<ManageColumn
					objectList={activeUsers}
					searchObjects={this.searchUsers}
					handleClickedObject={this.handleClickedUser}
				/>
				<div style={{ float: "right", width: "74%" }}>
					<ObjectEditTable
						objectArray={objectArry}
						updateList={this.getUsers}
						saveObject={this.saveUser}
						clickedObject={clickedUser}
						className="center"
						editting={editting}
						editObject={this.editObject}
					/>
				</div>
			</div>
		);
	}
}

export default UsersTable;
