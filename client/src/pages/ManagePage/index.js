import React, { Component } from "react";
import axios from "axios";

import Header from "../../components/Header/";
import ConnectAccountsSideBar from "../../components/SideBarAccounts/";
import UsersTable from "./UsersTable";
import PlansTable from "./PlansTable";
import "./style.css";

class ManagePage extends Component {
	state = {
		userTable: false
	};
	constructor(props) {
		super(props);

		// Make sure user is an admin!
		axios.get("/api/isUserSignedIn").then(res => {
			if (res.data[1].role !== "admin") {
				window.location.replace("/content");
			}
		});
		this.switchDivs = this.switchDivs.bind(this);
	}
	switchDivs(event) {
		this.setState({ userTable: !this.state.userTable });
	}
	render() {
		return (
			<div id="wrapper">
				<Header activePage="manage" />
				<ConnectAccountsSideBar />
				<div className="switch center">
					{!this.state.userTable && (
						<button className="switch-button active-switch" onClick={event => this.switchDivs(event)}>
							Edit Users
						</button>
					)}
					{this.state.userTable && (
						<button className="switch-button active-switch" onClick={event => this.switchDivs(event)}>
							Edit Plans
						</button>
					)}
				</div>
				{this.state.userTable ? <UsersTable /> : <PlansTable />}
			</div>
		);
	}
}

export default ManagePage;
