import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "../css/theme.css";
import "font-awesome/css/font-awesome.min.css";

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
			if (res.data[1].signedInAsUser) {
				this.props.updateParentState();
			}
		});
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
	openClientSideBar() {}

	render() {
		const { isLoggedIn } = this.state;
		if (!isLoggedIn) {
			return <Redirect to="/" />;
		}
		if (document.getElementById(this.props.activePage)) {
			document.getElementById(this.props.activePage).className += " header-active";
		}

		var adminButton;
		var clientButton;
		var signedInAsDiv;
		if (this.state.user.role === "admin" || this.state.user.role === "manager") {
			if (this.state.user.role === "admin") {
				var className;
				if (this.props.activePage === "manage") {
					className = "header-active";
				}
				adminButton = (
					<a id="manage" href="/manage" className={className}>
						Manage
					</a>
				);
			}
			clientButton = (
				<button className="big-round-button" onClick={() => this.openSideBar("clientsSideBar")}>
					My Clients
				</button>
			);
			if (this.state.user.signedInAsUser) {
				signedInAsDiv = <p id="signed-in-as">Logged in as: {this.state.user.signedInAsUser.fullName}</p>;
			}
		}

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
					{adminButton}
					<a id="strategy" href="/strategy">
						Strategy
					</a>
					<a id="content" href="/content">
						Content
					</a>

					<button className="big-round-button" onClick={() => this.openSideBar("mySidebar")}>
						Connect Accounts!
					</button>
					{clientButton}
				</div>
				{signedInAsDiv}
			</header>
		);
	}
}

export default Header;
