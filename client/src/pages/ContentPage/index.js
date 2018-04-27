import React, { Component } from "react";
import axios from "axios";

import Header from "../../components/Header/";
import Calendar from "./Calendar";
import ConnectAccountsSideBar from "../../components/SideBarAccounts/";
import ClientsSideBar from "../../components/SideBarClients/";

class Content extends Component {
	state = {
		padding: { paddingTop: "50px" },
		usersTimezone: "America/Vancouver"
	};
	constructor(props) {
		super(props);
		this.increaseHeaderPadding = this.increaseHeaderPadding.bind(this);
		this.getTimezone();
	}
	increaseHeaderPadding() {
		this.setState({ padding: { paddingTop: "70px" } });
	}
	getTimezone = () => {
		axios.get("/api/timezone").then(res => {
			if (res.data) {
				this.setState({ usersTimezone: res.data });
			}
		});
	};
	render() {
		return (
			<div id="wrapper" style={this.state.padding}>
				<ConnectAccountsSideBar />
				<ClientsSideBar />
				<Header activePage="content" updateParentState={this.increaseHeaderPadding} />

				<div id="main">
					<Calendar usersTimezone={this.state.usersTimezone} />
				</div>
			</div>
		);
	}
}
export default Content;
