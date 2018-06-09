import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage, setUser, updateAccounts, openClientSideBar } from "../../../redux/actions/";

import "./style.css";

class Header extends Component {
	openClientSideBar = () => {
		this.props.openClientSideBar(!this.props.clientSideBar);
	};

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
			let { success, loggedIn } = res.data;
			if (success) {
				this.props.setUser(null);
				this.props.updateAccounts([]);
				this.props.changePage("");
			} else {
				if (loggedIn === false) window.location.reload();
			}
		});
	};
	render() {
		const { user, activePage } = this.props;
		const { changePage } = this.props;

		if (!user) {
			changePage("");
			return <div style={{ display: "none" }} />;
		}

		let isAdmin = user.role === "admin";
		let isManager = user.role === "manager";
		return (
			<header>
				<div className="navbar">
					{(user.role === "manager" || isAdmin) && (
						<button className="big-round-button" onClick={() => this.openClientSideBar()}>
							My Clients
						</button>
					)}
					<div className="main-nav">
						{(user.role === "demo" || isAdmin) && (
							<a className={"header-button" + this.isActive("subscribe")} onClick={() => changePage("subscribe")}>
								Become Awesome
							</a>
						)}

						<a className={"header-button" + this.isActive("content")} onClick={() => changePage("content")}>
							Calendar
						</a>
						{isAdmin && (
							<a className={"header-button" + this.isActive("newCalendar")} onClick={() => changePage("newCalendar")}>
								New Calendar
							</a>
						)}
						{(isAdmin || isManager) && (
							<a className={"header-button" + this.isActive("writersBrief")} onClick={() => changePage("writersBrief")}>
								Monthly Strategy
							</a>
						)}

						<a className={"header-button" + this.isActive("accounts")} onClick={() => changePage("accounts")}>
							Social Profiles
						</a>
						<a className={"header-button" + this.isActive("strategy")} onClick={() => changePage("strategy")}>
							Your Questionnaire
						</a>
						{isAdmin && (
							<button
								className={"header-icon fa fa-cogs" + this.isActive("manage")}
								onClick={() => changePage("manage")}
							/>
						)}
						<div className="dropdown">
							<button className={"header-icon fa fa-user" + this.isActive("profile")} />

							<div className="dropdown-content">
								<a onClick={() => changePage("profile")}>Profile</a>
								<a onClick={() => this.logout()}>Logout</a>
							</div>
						</div>
					</div>
				</div>

				{(activePage === "content" ||
					activePage === "strategy" ||
					activePage === "newCalendar" ||
					activePage === "subscribe" ||
					activePage === "accounts") &&
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
		clientSideBar: state.clientSideBar
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			changePage: changePage,
			setUser: setUser,
			openClientSideBar: openClientSideBar,
			updateAccounts: updateAccounts
		},
		dispatch
	);
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);
