import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage, setUser, updateAccounts } from "./actions/";

import LoginPage from "./pages/LoginPage/";
import Content from "./pages/ContentPage/";
import Profile from "./pages/ProfilePage/";
import Strategy from "./pages/StrategyPage/";
import Manage from "./pages/ManagePage/";
import Plans from "./pages/PlansPage/";
import Header from "./components/Header/";
import ConnectAccountsSideBar from "./components/SideBarAccounts/";
import ClientsSideBar from "./components/SideBarClients/";
import "./css/theme.css";

class Routes extends Component {
	constructor(props) {
		super(props);
		axios.get("/api/user").then(res => {
			if (res.data.success) {
				props.setUser(res.data.user);
				props.changePage("content");
				// Get all connected accounts of the user
				axios.get("/api/accounts").then(res => {
					// Set user's accounts to state
					this.setState({ accounts: res.data });
					this.props.updateAccounts(res.data);
				});
			}
		});
	}
	render() {
		return (
			<div>
				<Header />
				{this.props.accountSideBar && <ConnectAccountsSideBar />}
				{this.props.clientSideBar && <ClientsSideBar />}

				{this.props.activePage === "" && <LoginPage />}
				{this.props.activePage === "content" && <Content />}
				{this.props.activePage === "profile" && <Profile />}
				{this.props.activePage === "strategy" && <Strategy />}
				{this.props.activePage === "manage" && <Manage />}
				{this.props.activePage === "subscribe" && <Plans />}
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
