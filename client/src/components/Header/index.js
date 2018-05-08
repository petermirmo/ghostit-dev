import React, { Component } from "react";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changePage, setUser, openAccountSideBar, openClientSideBar } from "../../actions/";

import "./style.css";

class Header extends Component {
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
	render() {
		const { user, activePage } = this.props;
		const { changePage } = this.props;

		if (!user) {
			changePage("");
			return <div style={{ display: "none" }} />;
		}

		let active = this.isActive("profile");
		let profile = <button className={"dropbtn" + active}>Profile</button>;

		active = this.isActive("manage");
		let manage = (
			<a className={"header-button" + active} onClick={() => changePage("manage")}>
				Manage
			</a>
		);

		active = this.isActive("strategy");
		let strategy = (
			<a className={"header-button" + active} onClick={() => changePage("strategy")}>
				Strategy
			</a>
		);

		active = this.isActive("content");
		let content = (
			<a className={"header-button" + active} onClick={() => changePage("content")}>
				Content
			</a>
		);

		active = this.isActive("subscribe");
		let plans = (
			<a className={"header-button" + active} onClick={() => changePage("subscribe")}>
				Become Awesome
			</a>
		);
		return (
			<header>
				<div className="navbar">
					<div className="dropdown">
						{profile}

						<div className="dropdown-content">
							<a onClick={() => changePage("profile")}>Profile</a>
							<a href="/api/logout">Logout</a>
						</div>
					</div>

					{user.role === "admin" && manage}
					{strategy}
					{content}
					{(user.role === "demo" || user.role === "admin") && plans}

					<button className="big-round-button" onClick={() => this.openAccountSideBar()}>
						Connect Accounts!
					</button>

					{(user.role === "manager" || user.role === "admin") && (
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
