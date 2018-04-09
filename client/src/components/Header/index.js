import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "font-awesome/css/font-awesome.min.css";
import "./style.css";

class Header extends Component {
	state = {
		isLoggedIn: true,
		user: { role: "demo" },
		signedInAs: {}
	};
	constructor(props) {
		super(props);

		// Logged in check
		axios.get("/api/isUserSignedIn").then(res => {
			this.setState({ isLoggedIn: res.data[0], user: res.data[1] });
			if (
				this.state.user.signedInAsUser &&
				(this.props.activePage === "content" || this.props.activePage === "strategy")
			) {
				this.props.updateParentState();
			}
		});
		this.signOutOfUsersAccount = this.signOutOfUsersAccount.bind(this);
	}
	openSideBar(id) {
		if (document.getElementById(id).style.display === "none") {
			document.getElementById(id).style.width = "25%";
			document.getElementById(id).style.display = "block";
		} else {
			document.getElementById(id).style.display = "none";
		}
		if (document.getElementById("main")) {
			if (document.getElementById("main").style.marginLeft === "25%") {
				document.getElementById("main").style.marginLeft = "0%";
			} else {
				document.getElementById("main").style.marginLeft = "25%";
			}
		}
	}
	signOutOfUsersAccount() {
		axios.get("/api/signOutOfUserAccount").then(res => {
			window.location.reload();
		});
	}

	render() {
		const { isLoggedIn } = this.state;
		if (!isLoggedIn) {
			return <Redirect to="/" />;
		}

		if (document.getElementById(this.props.activePage)) {
			document.getElementById(this.props.activePage).className += " header-active";
		}

		let managePageButton;
		let signIntoClientsButton;
		let plansPageButton;

		let signedInAsDiv;
		if (this.state.user.role === "admin" || this.state.user.role === "manager") {
			if (this.state.user.role === "admin") {
				let className;
				if (this.props.activePage === "manage") {
					className = "header-active";
				}
				managePageButton = (
					<a id="manage" href="/manage" className={className}>
						Manage
					</a>
				);
			}

			if (this.props.activePage === "content" || this.props.activePage === "strategy") {
				if (this.state.user.signedInAsUser) {
					signedInAsDiv = (
						<div className="signed-in-as center">
							<p>Logged in as: {this.state.user.signedInAsUser.fullName}</p>
							<button className="fa fa-times" onClick={() => this.signOutOfUsersAccount()} />
						</div>
					);
				}
				signIntoClientsButton = (
					<button className="big-round-button" onClick={() => this.openSideBar("clientsSideBar")}>
						My Clients
					</button>
				);
			}
		} else {
		}
		plansPageButton = (
			<a id="plans" href="/subscribe">
				Upgrade to Business Superhero
			</a>
		);

		return (
			<header>
				<div className="navbar">
					<div className="dropdown">
						<button id="profile" href="/profile" className="dropbtn">
							Profile
						</button>
						<div className="dropdown-content">
							<a href="/profile">Profile</a>
							<a href="/api/logout">Logout</a>
						</div>
					</div>
					{managePageButton}
					<a id="strategy" href="/strategy">
						Strategy
					</a>
					<a id="content" href="/content">
						Content
					</a>
					{plansPageButton}

					<button className="big-round-button" onClick={() => this.openSideBar("mySidebar")}>
						Connect Accounts!
					</button>
					{signIntoClientsButton}
				</div>
				{signedInAsDiv}
			</header>
		);
	}
}

export default Header;
