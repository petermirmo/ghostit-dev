import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage, setUser, updateAccounts } from "./redux/actions/";

import LoginPage from "./pages/LoginPage/";

import Header from "./components/Navigations/Header/";
import ClientsSideBar from "./components/SideBarClients/";

import Plans from "./pages/PlansPage/";
import Content from "./pages/ContentPage/";
import Strategy from "./pages/StrategyPage/";
import Accounts from "./pages/AccountsPage/";
import Manage from "./pages/ManagePage/";
import Profile from "./pages/ProfilePage/";

import Analytics from "./pages/AnalyticsPage/";
import WritersBrief from "./pages/WritersBriefPage/";

import "./css/theme.css";

class Routes extends Component {
	constructor(props) {
		super(props);
		axios.get("/api/user").then(res => {
			let { success, user } = res.data;

			if (success) {
				// Get all connected accounts of the user
				axios.get("/api/accounts").then(res => {
					// Set user's accounts to state
					let { accounts } = res.data;
					if (!accounts) accounts = [];
					props.updateAccounts(accounts);
					props.setUser(user);
					props.changePage("content");
				});
			}
		});
	}
	render() {
		const { activePage, clientSideBar } = this.props;

		return (
			<div>
				{activePage !== "" && <Header />}
				{clientSideBar && <ClientsSideBar />}

				{activePage === "" && <LoginPage />}
				{activePage === "subscribe" && <Plans />}
				{activePage === "content" && <Content />}
				{activePage === "strategy" && <Strategy />}
				{activePage === "analytics" && <Analytics />}
				{activePage === "accounts" && <Accounts />}
				{activePage === "writersBrief" && <WritersBrief />}
				{activePage === "manage" && <Manage />}
				{activePage === "profile" && <Profile />}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		activePage: state.activePage,
		user: state.user,
		clientSideBar: state.clientSideBar,
		accountSideBar: state.accountSideBar
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({ changePage: changePage, setUser: setUser, updateAccounts: updateAccounts }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Routes);
