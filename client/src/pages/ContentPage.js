import React, { Component } from "react";

import "../css/theme.css";
import Header from "../components/HeaderComponent";
import Calendar from "../components/CalendarComponent";
import SideBar from "../components/SideBar";

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
};
class Content extends Component {
	render() {
		return (
			<div id="wrapper">
				<SideBar />
				<Header activePage="content" />

				<div id="main">
					<Calendar />
				</div>
			</div>
		);
	}
}

export default Content;
