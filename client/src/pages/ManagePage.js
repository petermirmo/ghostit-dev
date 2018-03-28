import React, { Component } from "react";
import axios from "axios";

import Header from "../components/HeaderComponent";
import ConnectAccountsSideBar from "../components/ConnectAccountsSideBar";
import UsersTable from "../components/UsersTable";

class ManagePage extends Component {
	constructor(props) {
		super(props);

		// Make sure user is an admin!
		axios.get("/api/isUserSignedIn").then(res => {
			if (res.data[1].role !== "admin") {
				window.location.replace("/content");
			}
		});
	}
	render() {
		return (
			<div id="wrapper">
				<Header activePage="manage" />
				<ConnectAccountsSideBar />
				<UsersTable />
			</div>
		);
	}
}

export default ManagePage;
