import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { openAccountSideBar, updateAccounts } from "../../actions/";

import AddPageOrGroupModal from "./AddPagesOrGroupsModal/";
import ConnectedAccountsDiv from "./ConnectedAccountsDiv";
import "../../css/sideBar.css";
import "./style.css";

class ConnectAccountsSideBar extends Component {
	state = {
		accounts: this.props.accounts,
		pageOrGroup: [],
		accountType: "",
		socialType: "",
		errorMessage: "",
		addPageOrGroupModal: false
	};

	closeSideBar = () => {
		this.props.openAccountSideBar(!this.props.accountSideBar);
	};

	openModal(socialType, accountType) {
		// Open facebook add page modal
		this.setState({ addPageOrGroupModal: true });
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

	getUserAccounts = () => {
		// Get all connected accounts of the user
		axios.get("/api/accounts").then(res => {
			// Set user's accounts to state
			this.setState({ accounts: res.data });
			this.props.updateAccounts(res.data);
		});
	};

	getFacebookPages() {
		this.setState({
			accountType: "page",
			socialType: "facebook",
			pageOrGroup: []
		});
		axios.get("/api/facebook/pages").then(res => {
			var errorMessage = "";

			var pageOrGroup = res.data.data;

			// If pageOrGroup returns false, there was an error so just set to undefined
			if (pageOrGroup === false) {
				pageOrGroup = [];
			}

			if (pageOrGroup === []) {
				errorMessage = "No Facebook pages found";
			} else {
				errorMessage = "Please connect your Facebook profile first.";
			}
			// Set data to state
			this.setState({
				pageOrGroup: pageOrGroup,

				errorMessage: errorMessage
			});
		});
	}
	getFacebookGroups() {
		this.setState({
			accountType: "group",
			socialType: "facebook",
			pageOrGroup: []
		});
		axios.get("/api/facebook/groups").then(res => {
			var message;

			// Set user's facebook groups to state
			var pageOrGroup = res.data;

			// If pageOrGroup returns false, there was an error so just set to undefined
			if (pageOrGroup === false) {
				pageOrGroup = [];
			}

			if (pageOrGroup === []) {
				message = "No Facebook pages found";
			} else {
				message = "Please connect your Facebook profile first.";
			}
			// Set data to state
			this.setState({
				pageOrGroup: pageOrGroup,
				errorMessage: message
			});
		});
	}
	getLinkedinPages() {
		this.setState({
			accountType: "page",
			socialType: "linkedin",
			pageOrGroup: []
		});
		axios.get("/api/linkedin/pages").then(res => {
			var message;
			// Check to see if array is empty or a profile account was found
			var pageOrGroup = res.data;

			// If pageOrGroup returns false, there was an error so just set to []
			if (pageOrGroup === false) {
				pageOrGroup = [];
			}

			if (pageOrGroup === []) {
				message = "No Linkedin pages found";
			} else {
				message = "Please connect your Linkedin profile first.";
			}
			// Set data to state
			this.setState({
				pageOrGroup: pageOrGroup,
				errorMessage: message
			});
		});
	}
	close = () => {
		this.setState({ addPageOrGroupModal: false });
	};
	render() {
		// Initialize
		const { accounts } = this.state;

		return (
			<div className="side-bar animate-left">
				<div className="side-bar-container center">
					<span className="close-dark" style={{ margin: "0" }} onClick={() => this.closeSideBar()}>
						&times;
					</span>
					<br />
					<ConnectedAccountsDiv accounts={accounts} getUserAccounts={this.getUserAccounts} />
					<button
						className="social-header-button facebook"
						onClick={() => {
							window.location = "/api/facebook";
						}}
					>
						Connect Facebook
					</button>
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
					<button
						className="social-header-button twitter"
						onClick={() => {
							window.location = "/api/twitter";
						}}
					>
						Connect Twitter
					</button>
					<button
						className="side-bar-button-center twitter"
						style={{ width: "60%" }}
						onClick={() => {
							window.location = "/api/twitter";
						}}
					>
						Profile
					</button>
					<button
						className="social-header-button linkedin"
						onClick={() => {
							window.location = "/api/linkedin";
						}}
					>
						Connect Linkedin
					</button>
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
					<button className="social-header-button instagram">Connect Instagram</button>
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
				{this.state.addPageOrGroupModal && (
					<AddPageOrGroupModal
						getUserAccounts={this.getUserAccounts}
						pageOrGroup={this.state.pageOrGroup}
						accountType={this.state.accountType}
						socialType={this.state.socialType}
						errorMessage={this.state.errorMessage}
						close={this.close}
					/>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		clientSideBar: state.clientSideBar,
		accountSideBar: state.accountSideBar,
		accounts: state.accounts
	};
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({ openAccountSideBar: openAccountSideBar, updateAccounts: updateAccounts }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(ConnectAccountsSideBar);
