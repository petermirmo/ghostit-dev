import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "../css/theme.css";
import "font-awesome/css/font-awesome.min.css";

class Header extends Component {
	state = {
		isLoggedIn: true,
		role: "demo"
	};
	constructor(props) {
		super(props);

		// Logged in check
		axios.get("/api/isUserSignedIn").then(res => {
			this.setState({ isLoggedIn: res.data[0], role: res.data[1] });
		});
	}
	openSideBar() {
		document.getElementById("mySidebar").style.width = "25%";
		document.getElementById("mySidebar").style.display = "block";
		if (document.getElementById("main")) document.getElementById("main").style.marginLeft = "25%";
	}

	render() {
		const { isLoggedIn } = this.state;
		if (!isLoggedIn) {
			return <Redirect to="/" />;
		}
		if (document.getElementById(this.props.activePage)) {
			document.getElementById(this.props.activePage).className += " header-active";
		}

		var adminButton;
		if (this.state.role === "admin") {
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

					<button id="navBarOpen" onClick={() => this.openSideBar()} className="fa fa-bars fa-2x" />
				</div>
			</header>
		);
	}
}

export default Header;
