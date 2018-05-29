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
				//	this.props.setUser(undefined);
				//this.props.updateAccounts([]);
				this.props.changePage("");
			} else {
				alert("something went wrong. Please load the page!");
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

						<a className={"header-button" + this.isActive("strategy")} onClick={() => changePage("strategy")}>
							Strategy
						</a>

						<a className={"header-button" + this.isActive("accounts")} onClick={() => changePage("accounts")}>
							Social Profiles
						</a>
						{isAdmin && (
							<button
								className={"header-icon fa fa-edit" + this.isActive("writersBrief")}
								onClick={() => changePage("writersBrief")}
							/>
						)}
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
			openClientSideBar: openClientSideBar,
			updateAccounts: updateAccounts
		},
		dispatch
	);
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);
