import React, { Component } from "react";
import axios from "axios";

import AddPageOrGroupModal from "./AddPagesOrGroupsModal";
import ConnectedAccountsDiv from "./ConnectedAccountsDiv";
import "../../css/sideBar.css";

class ConnectAccountsSideBar extends Component {
	state = {
		accounts: [],
		pageOrGroup: [],
		accountType: "",
		socialType: "",
		errorMessage: ""
	};
	constructor(props) {
		super(props);
		this.getUserAccounts = this.getUserAccounts.bind(this);

		this.getUserAccounts();
	}

	closeSideBar() {
		document.getElementById("mySidebar").style.display = "none";
		if (document.getElementById("main")) document.getElementById("main").style.marginLeft = "0%";
	}

	openModal(socialType, accountType) {
		// Open facebook add page modal
		var modal = document.getElementById("addPagesOrGroupsModal");
		modal.style.display = "block";

		if (socialType === "facebook") {
			if (accountType === "page") {
				this.getFacebookPages();
			} else if (accountType === "group") {
				this.getFacebookGroups();
			}
		} else if (socialType === "linkedin") {
			if (accountType === "page") {
				this.getLinkedinPages();
			}
		}
	}

	getUserAccounts() {
		// Get all connected accounts of the user
		axios.get("/api/accounts").then(res => {
			console.log(res.data);
			// Set user's accounts to state
			this.setState({ accounts: res.data });
		});
	}

	getFacebookPages() {
		axios.get("/api/facebook/pages").then(res => {
			var errorMessage = "";

			var pageOrGroup = res.data.data;

			// If pageOrGroup returns false, there was an error so just set to undefined
			if (pageOrGroup === false) {
				pageOrGroup = undefined;
			}

			if (pageOrGroup === []) {
				errorMessage = "No Facebook pages found";
			} else {
				errorMessage = "Please connect your Facebook profile first.";
			}
			// Set data to state
			this.setState({
				pageOrGroup: pageOrGroup,
				accountType: "page",
				socialType: "facebook",
				errorMessage: errorMessage
			});
		});
	}
	getFacebookGroups() {
		axios.get("/api/facebook/groups").then(res => {
			var message;

			// Set user's facebook groups to state
			var pageOrGroup = res.data;

			// If pageOrGroup returns false, there was an error so just set to undefined
			if (pageOrGroup === false) {
				pageOrGroup = undefined;
			}

			if (pageOrGroup === []) {
				message = "No Facebook pages found";
			} else {
				message = "Please connect your Facebook profile first.";
			}
			// Set data to state
			this.setState({
				pageOrGroup: pageOrGroup,
				accountType: "group",
				socialType: "facebook",
				errorMessage: message
			});
		});
	}
	getLinkedinPages() {
		axios.get("/api/linkedin/pages").then(res => {
			var message;
			// Check to see if array is empty or a profile account was found
			var pageOrGroup = res.data;

			// If pageOrGroup returns false, there was an error so just set to undefined
			if (pageOrGroup === false) {
				pageOrGroup = undefined;
			}

			if (pageOrGroup === []) {
				message = "No Linkedin pages found";
			} else {
				message = "Please connect your Linkedin profile first.";
			}
			// Set data to state
			this.setState({
				pageOrGroup: pageOrGroup,
				accountType: "page",
				socialType: "linkedin",
				errorMessage: message
			});
		});
	}
	render() {
		// Initialize
		var accounts = this.state.accounts;

		return (
			<div className="side-bar animate-left" style={{ display: "none" }} id="mySidebar">
				<AddPageOrGroupModal
					getUserAccounts={this.getUserAccounts}
					pageOrGroup={this.state.pageOrGroup}
					accountType={this.state.accountType}
					socialType={this.state.socialType}
					errorMessage={this.state.errorMessage}
				/>

				<span className="close-dark" onClick={() => this.closeSideBar()}>
					&times;
				</span>
				<br />
				<br />
				<ConnectedAccountsDiv accounts={accounts} getUserAccounts={this.getUserAccounts} />
				<div className="side-bar-container center">
					<h4 className="facebook">Connect Facebook</h4>
					<button
						className="side-bar-button-center facebook"
						onClick={() => {
							window.location = "/api/facebook";
						}}
					>
						Profile
					</button>
					<button className="side-bar-button-center facebook" onClick={() => this.openModal("facebook", "page")}>
						Page
					</button>
					<button className="side-bar-button-center facebook" onClick={() => this.openModal("facebook", "group")}>
						Group
					</button>
					<h4 className="twitter">Connect Twitter</h4>
					<button
						className="side-bar-button-center twitter"
						style={{ width: "60%" }}
						onClick={() => {
							window.location = "/api/twitter";
						}}
					>
						Profile
					</button>
					<h4 className="linkedin">Connect Linkedin</h4>
					<button
						className="side-bar-button-center linkedin"
						onClick={() => {
							window.location = "/api/linkedin";
						}}
					>
						Profile
					</button>
					<button className="side-bar-button-center linkedin" onClick={() => this.openModal("linkedin", "page")}>
						Page
					</button>
					<h4 className="instagram">Connect Instagram</h4>
					<button
						className="side-bar-button-center instagram"
						style={{
							width: "60%",
							cursor: "default",
							marginBottom: "100px"
						}}
					>
						Coming Soon!
					</button>
				</div>
			</div>
		);
	}
}

export default ConnectAccountsSideBar;
