import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "../css/theme.css";
import "font-awesome/css/font-awesome.min.css";

class Header extends Component {
	state = {
		isLoggedIn: true
	};
	constructor(props) {
		super(props);

		// Logged in check
		axios.get("/api/isUserSignedIn").then(res => this.setState({ isLoggedIn: res.data }));
	}
	openSideBar() {
		document.getElementById("mySidebar").style.width = "25%";
		document.getElementById("mySidebar").style.display = "block";
		if (document.getElementById("main")) document.getElementById("main").style.marginLeft = "25%";
	}
	switchTabs(event) {
		var clickedNavBarTab = event;

		// Check if this is the active class
		if (clickedNavBarTab.classList.contains("header-active")) {
			// If it is already active tab, do nothing
			return;
		} else {
			// Take away active class from all other tabs
			var tabs = document.getElementsByClassName("header-active");
			for (var index = 0; index < tabs.length; index++) {
				tabs[index].classList.remove("header-active");
			}
			clickedNavBarTab.className += " header-active";
		}
	}
	render() {
		const { isLoggedIn } = this.state;
		if (!isLoggedIn) {
			return <Redirect to="/" />;
		}
		if (document.getElementById(this.props.activePage)) {
			document.getElementById(this.props.activePage).className += " header-active";
		}

		return (
			<header>
				<div className="navbar">
					<div className="dropdown">
						<button id="profile" href="/profile" className="dropbtn">
							Profile
						</button>
						<div className="dropdown-content">
							<a onClick={event => this.switchTabs(document.getElementById("profile"))} href="/profile">
								Profile
							</a>
							<a href="/api/logout">Logout</a>
						</div>
					</div>
					<a id="strategy" href="/strategy" onClick={event => this.switchTabs(event.target)}>
						Strategy
					</a>
					<a id="content" href="/content" onClick={event => this.switchTabs(event.target)}>
						Content
					</a>

					<button id="navBarOpen" onClick={() => this.openSideBar()} className="fa fa-bars fa-2x" />
				</div>
			</header>
		);
	}
}

export default Header;
