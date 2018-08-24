import React, { Component } from "react";
import axios from "axios";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faBars from "@fortawesome/fontawesome-free-solid/faBars";
import faTimes from "@fortawesome/fontawesome-free-solid/faTimes";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage, setUser, updateAccounts, openHeaderSideBar, openClientSideBar } from "./redux/actions/";

import LoaderWedge from "./components/Notifications/LoaderWedge";

import Header from "./components/Navigations/Header/";
import ClientsSideBar from "./components/SideBarClients/";

import LoginPage from "./pages/LoginPage/";
import Subscribe from "./pages/SubscribePage/";
import Content from "./pages/ContentPage/";
import Strategy from "./pages/StrategyPage/";
import Accounts from "./pages/AccountsPage/";
import Manage from "./pages/ManagePage/";
import Profile from "./pages/ProfilePage/";

import Analytics from "./pages/AnalyticsPage/";
import WritersBrief from "./pages/WritersBriefPage/";

import "./css/";

class Routes extends Component {
	state = {
		datebaseConnection: false
	};
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
					props.changePage("subscribe");
					this.setState({ datebaseConnection: true });
				});
			} else {
				this.setState({ datebaseConnection: true });
			}
		});
	}

	signOutOfUsersAccount = () => {
		axios.get("/api/signOutOfUserAccount").then(res => {
			let { success, loggedIn, user } = res.data;
			if (success) {
				this.props.setUser(user);
				window.location.reload();
			} else {
				if (loggedIn === false) window.location.reload();
			}
		});
	};
	openHeader = () => {
		this.props.openHeaderSideBar(true);
	};
	openClientSideBar = () => {
		this.props.openClientSideBar(!this.props.clientSideBar);
	};
	render() {
		const { datebaseConnection } = this.state;
		const { activePage, clientSideBar, headerSideBar, user } = this.props;
		let accessClientButton;
		if (user) {
			accessClientButton = (user.role === "manager" || user.role === "admin") && (
				<button className="my-client-button" onClick={() => this.openClientSideBar()}>
					My Clients
				</button>
			);
		}
		let margin;
		if (headerSideBar) margin = { marginLeft: "20%" };

		if (!datebaseConnection) return <LoaderWedge />;

		return (
			<div>
				<div className="main-navigation-container">
					{user &&
						((activePage === "content" ||
							activePage === "strategy" ||
							activePage === "newCalendar" ||
							activePage === "writersBrief" ||
							activePage === "subscribe" ||
							activePage === "accounts") &&
							user.signedInAsUser && (
								<div className="signed-in-as center">
									<p>Logged in as: {user.signedInAsUser.fullName}</p>
									<FontAwesomeIcon
										icon={faTimes}
										onClick={() => this.signOutOfUsersAccount()}
										className="sign-out-of-clients-account"
									/>
								</div>
							))}
					{accessClientButton}
					{activePage !== "" &&
						!headerSideBar && (
							<FontAwesomeIcon icon={faBars} size="2x" className="activate-header-button" onClick={this.openHeader} />
						)}
				</div>
				{activePage !== "" && headerSideBar && <Header />}
				{clientSideBar && <ClientsSideBar />}

				{activePage === "" && <LoginPage margin={margin} />}
				{activePage === "subscribe" && <Subscribe margin={margin} />}
				{activePage === "content" && <Content margin={margin} />}
				{activePage === "strategy" && <Strategy margin={margin} />}
				{activePage === "analytics" && <Analytics margin={margin} />}
				{activePage === "accounts" && <Accounts margin={margin} />}
				{activePage === "writersBrief" && <WritersBrief margin={margin} />}
				{activePage === "manage" && <Manage margin={margin} />}
				{activePage === "profile" && <Profile margin={margin} />}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		activePage: state.activePage,
		user: state.user,
		clientSideBar: state.clientSideBar,
		headerSideBar: state.headerSideBar
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			changePage: changePage,
			setUser: setUser,
			updateAccounts: updateAccounts,
			openHeaderSideBar: openHeaderSideBar,
			openClientSideBar: openClientSideBar
		},
		dispatch
	);
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Routes);
