import React, { Component } from "react";

import Header from "../../components/Header/index";
import Calendar from "./CalendarComponent";
import ConnectAccountsSideBar from "../../components/SideBarAccounts/SideBarAccounts";
import ClientsSideBar from "../../components/SideBarClients/SideBarClients";

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	// Turn off posting modal
	var postingModal = document.getElementById("postingModal");
	if (event.target === postingModal) {
		postingModal.style.display = "none";
		return;
	}

	// Turn off facebook pages modal
	var facebookModal = document.getElementById("addPagesOrGroupsModal");
	if (event.target === facebookModal) {
		facebookModal.style.display = "none";
		return;
	}

	var edittingModal = document.getElementById("edittingModal");
	if (event.target === edittingModal) {
		edittingModal.style.display = "none";
		return;
	}

	var BlogEdittingModal = document.getElementById("BlogEdittingModal");
	if (event.target === BlogEdittingModal) {
		BlogEdittingModal.style.display = "none";
		return;
	}
};
class Content extends Component {
	state = {
		padding: { paddingTop: "50px" }
	};
	constructor(props) {
		super(props);
		this.increaseHeaderPadding = this.increaseHeaderPadding.bind(this);
	}
	increaseHeaderPadding() {
		this.setState({ padding: { paddingTop: "70px" } });
	}
	render() {
		return (
			<div id="wrapper" style={this.state.padding}>
				<ConnectAccountsSideBar />
				<ClientsSideBar />
				<Header activePage="content" updateParentState={this.increaseHeaderPadding} />

				<div id="main">
					<Calendar />
				</div>
			</div>
		);
	}
}

export default Content;
