import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateAccounts } from "../../redux/actions/";

import AddPageOrGroupModal from "./AddPagesOrGroupsModal/";
import ConfirmAlert from "../../components/Notifications/ConfirmAlert/";
import "./style.css";

class AccountsPage extends Component {
	state = {
		accounts: this.props.accounts,
		pageOrGroup: [],
		accountType: "",
		socialType: "",
		errorMessage: "",
		addPageOrGroupModal: false,
		accountToDelete: undefined,
		deleteAccount: false
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
			let { accounts, success, loggedIn } = res.data;
			if (success) {
				// Set user's accounts to state
				this.setState({ accounts: accounts });
				this.props.updateAccounts(accounts);
			} else {
				if (loggedIn === false) window.location.reload();
			}
		});
	};

	getFacebookPages() {
		this.setState({
			accountType: "page",
			socialType: "facebook",
			pageOrGroup: []
		});
		axios.get("/api/facebook/pages").then(res => {
			let errorMessage = "";

			let { pages, loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			// If pages returns false, there was an error so just set to undefined
			if (!pages) {
				pages = [];
			}

			if (pages.length === 0) {
				errorMessage = "No Facebook pages found";
			} else {
				errorMessage = "Please connect your Facebook profile first.";
			}
			// Set data to state
			this.setState({
				pageOrGroup: pages,

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
			let message;

			// Set user's facebook groups to state
			let { groups, loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			// If groups returns false, there was an error so just set to undefined
			if (!groups) {
				groups = [];
			}

			if (groups.length === 0) {
				message = "No Facebook pages found";
			} else {
				message = "Please connect your Facebook profile first.";
			}
			// Set data to state
			this.setState({
				pageOrGroup: groups,
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
			let message;
			// Check to see if array is empty or a profile account was found
			let { pages, loggedIn } = res.data;
			if (loggedIn === false) window.location.reload();

			// If pageOrGroup returns false, there was an error so just set to []
			if (!pages) {
				pages = [];
			}

			if (pages.length === 0) {
				message = "No Linkedin pages found";
			} else {
				message = "Please connect your Linkedin profile first.";
			}
			// Set data to state
			this.setState({
				pageOrGroup: pages,
				errorMessage: message
			});
		});
	}
	deleteConfirm = account => {
		this.setState({ accountToDelete: account, deleteAccount: true });
	};
	disconnectAccount = confirmDelete => {
		const { accountToDelete } = this.state;
		if (confirmDelete && confirmDelete) {
			axios.delete("/api/account", { data: accountToDelete }).then(res => {
				// Set user's facebook pages to state
				if (res.data) {
					this.getUserAccounts();
				}
				this.setState({ accountToDelete: undefined, deleteAccount: false });
			});
		} else {
			this.setState({ accountToDelete: undefined, deleteAccount: false });
		}
	};
	pushNewConnectedAccountDiv = (connectedAccountsDivArray, account) => {
		let name;
		if (account.givenName) name = account.givenName.charAt(0).toUpperCase() + account.givenName.slice(1);
		if (account.familyName) name += " " + account.familyName.charAt(0).toUpperCase() + account.familyName.slice(1);
		if (account.username !== "" && account.username) name = account.username;

		connectedAccountsDivArray.push(
			<div className="connected-social-div" key={connectedAccountsDivArray.length + account.socialType}>
				<div className={"fa fa-" + account.socialType + " fa-2x connected-social-media-icon " + account.socialType} />
				<div className="connected-social center ">
					<h4>{name}</h4>
					<p>
						{account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
						<button className="fa fa-trash delete" onClick={event => this.deleteConfirm(account)} />
					</p>
				</div>
			</div>
		);
	};
	close = () => {
		this.setState({ addPageOrGroupModal: false });
	};
	render() {
		const {
			accounts,
			addPageOrGroupModal,
			deleteAccount,
			errorMessage,
			pageOrGroup,
			socialType,
			accountType
		} = this.state;

		let connectedFacebookAccountDivs = [];
		let connectedTwitterAccountDivs = [];
		let connectedLinkedinAccountDivs = [];

		for (let index in accounts) {
			let account = accounts[index];
			switch (account.socialType) {
				case "facebook":
					this.pushNewConnectedAccountDiv(connectedFacebookAccountDivs, account);
					break;
				case "twitter":
					this.pushNewConnectedAccountDiv(connectedTwitterAccountDivs, account);
					break;
				case "linkedin":
					this.pushNewConnectedAccountDiv(connectedLinkedinAccountDivs, account);
					break;
				default:
				// There is an error
			}
		}
		return (
			<div id="wrapper">
				<div className="accounts-wrapper">
					<div className="account-column">
						<button
							className="social-header-button facebook"
							onClick={() => {
								window.location = "/api/facebook";
							}}
						>
							Connect Facebook
						</button>

						<button className="social-media-connect facebook" onClick={() => this.openModal("facebook", "page")}>
							Page
						</button>
						<button className="social-media-connect facebook" onClick={() => this.openModal("facebook", "group")}>
							Group
						</button>
						{connectedFacebookAccountDivs}
					</div>
					<div className="account-column">
						<button
							className="social-header-button twitter"
							onClick={() => {
								window.location = "/api/twitter";
							}}
						>
							Connect Twitter
						</button>

						{connectedTwitterAccountDivs}
					</div>
					<div className="account-column">
						<button
							className="social-header-button linkedin"
							onClick={() => {
								window.location = "/api/linkedin";
							}}
						>
							Connect Linkedin
						</button>

						<button className="social-media-connect linkedin" onClick={() => this.openModal("linkedin", "page")}>
							Page
						</button>
						{connectedLinkedinAccountDivs}
					</div>
					<div className="account-column">
						<button className="social-header-button instagram">Connect Instagram</button>
						<button className="social-media-connect instagram">Coming Soon!</button>
					</div>
				</div>
				{addPageOrGroupModal && (
					<AddPageOrGroupModal
						getUserAccounts={this.getUserAccounts}
						pageOrGroup={pageOrGroup}
						accountType={accountType}
						socialType={socialType}
						errorMessage={errorMessage}
						close={this.close}
					/>
				)}
				{deleteAccount && (
					<ConfirmAlert
						title="Delete Account"
						message="Are you sure you want to delete this social account from our software?"
						callback={this.disconnectAccount}
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
	return bindActionCreators({ updateAccounts: updateAccounts }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage);
