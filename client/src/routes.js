import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage, setUser, updateAccounts } from "./redux/actions/";

import LoginPage from "./pages/LoginPage/";
import Content from "./pages/ContentPage/";
import Analytics from "./pages/AnalyticsPage/";
import Accounts from "./pages/AccountsPage/";
import Profile from "./pages/ProfilePage/";
import Strategy from "./pages/StrategyPage/";
import Manage from "./pages/ManagePage/";
import Plans from "./pages/PlansPage/";
import Header from "./components/Navigations/Header/";
import ClientsSideBar from "./components/SideBarClients/";
import "./css/theme.css";

class Routes extends Component {
	constructor(props) {
		super(props);
		axios.get("/api/user").then(res => {
			if (res.data.success) {
				props.setUser(res.data.user);
				// Get all connected accounts of the user
				axios.get("/api/accounts").then(res => {
					// Set user's accounts to state
					this.setState({ accounts: res.data });
					this.props.updateAccounts(res.data);
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
				{activePage === "content" && <Content />}
				{activePage === "analytics" && <Analytics />}
				{activePage === "accounts" && <Accounts />}
				{activePage === "strategy" && <Strategy />}
				{activePage === "profile" && <Profile />}
				{activePage === "manage" && <Manage />}
				{activePage === "subscribe" && <Plans />}
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
