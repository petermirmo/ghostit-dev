import React, { Component } from "react";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage, setUser, openAccountSideBar, openClientSideBar } from "../../actions/";
import OnboardingModal from "../OnboardingModal/";

import "./style.css";

class Header extends Component {
	state = {
		newClient: false
	};
	closeOnboardingModal = () => {
		this.setState({ newClient: false });
	};
	openClientSideBar = () => {
		this.props.openClientSideBar(!this.props.clientSideBar);
	};
	openAccountSideBar = () => {
		this.props.openAccountSideBar(!this.props.accountSideBar);
	};
	signOutOfUsersAccount = () => {
		axios.get("/api/signOutOfUserAccount").then(res => {
			if (res.data.success) {
				this.props.setUser(res.data.user);
				window.location.reload();
			}
		});
	};
	isActive = page => {
		switch (this.props.activePage) {
			case page:
				return " header-active";
			default:
				return "";
		}
	};
	logout = () => {
		axios.get("/api/logout").then(res => {
			if (res.data.success) {
				this.props.changePage("");
			} else {
				alert("something went wrong. Please load the page!");
			}
		});
	};
	render() {
		const { newClient } = this.state;
		const { user, activePage } = this.props;
		const { changePage } = this.props;

		if (!user) {
			changePage("");
			return <div style={{ display: "none" }} />;
		}

		let isAdmin = user.role === "admin";
		return (
			<header>
				<div className="navbar">
					<div className="dropdown">
						{<button className={"dropbtn" + this.isActive("profile")}>Profile</button>}

						<div className="dropdown-content">
							<a onClick={() => changePage("profile")}>Profile</a>
							<a onClick={() => this.logout()}>Logout</a>
						</div>
					</div>

					{isAdmin && (
						<a className={"header-button" + this.isActive("manage")} onClick={() => changePage("manage")}>
							Manage
						</a>
					)}
					{
						<a className={"header-button" + this.isActive("strategy")} onClick={() => changePage("strategy")}>
							Strategy
						</a>
					}
					{
						<a className={"header-button" + this.isActive("content")} onClick={() => changePage("content")}>
							Content
						</a>
					}
					{(user.role === "demo" || isAdmin) && (
						<a className={"header-button" + this.isActive("subscribe")} onClick={() => changePage("subscribe")}>
							Become Awesome
						</a>
					)}
					{newClient && <OnboardingModal close={this.closeOnboardingModal} />}
					{isAdmin && (
						<a
							className={"header-button"}
							onClick={() => {
								this.setState({ newClient: !this.state.newClient });
							}}
						>
							Testing Onboarding Modal
						</a>
					)}
					<button className="big-round-button" onClick={() => this.openAccountSideBar()}>
						Connect Accounts!
					</button>

					{(user.role === "manager" || isAdmin) && (
						<button className="big-round-button" onClick={() => this.openClientSideBar()}>
							My Clients
						</button>
					)}
				</div>

				{(activePage === "content" || activePage === "strategy" || activePage === "subscribe") &&
					user.signedInAsUser && (
						<div className="signed-in-as center">
							<p>Logged in as: {user.signedInAsUser.fullName}</p>
							<button className="fa fa-times" onClick={() => this.signOutOfUsersAccount()} />
						</div>
					)}
			</header>
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
	return bindActionCreators(
		{
			changePage: changePage,
			setUser: setUser,
			openAccountSideBar: openAccountSideBar,
			openClientSideBar: openClientSideBar
		},
		dispatch
	);
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);
