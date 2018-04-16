import React, { Component } from "react";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import { confirmAlert } from "react-confirm-alert";

class ConnectedAccountsList extends Component {
	constructor(props) {
		super(props);

		this.confirmDelete = this.confirmDelete.bind(this);
	}
	confirmDelete(event) {
		// ID of event.target is the index in the props account array
		var account = this.props.accounts[event.target.id];
		let name = account.socialType + " " + account.accountType + " " + account.givenName;
		if (account.familyName) name += " " + account.familyName;

		var message = "Are you sure you want to disconnect " + name + "?";
		if (account.accountType === "profile") {
			message += " Disconnecting a profile account will also disconnect all groups and pages.";
		}

		confirmAlert({
			title: "Disconnect Account", // Title dialog
			message: message, // Message dialog
			confirmLabel: "Confirm", // Text button confirm
			cancelLabel: "Cancel", // Text button cancel
			onConfirm: () => this.disconnectAccount(account), // Action after Confirm
			onCancel: () => {} // Action after Cancel
		});
	}
	disconnectAccount(account) {
		axios.delete("/api/account", { data: account }).then(res => {
			// Set user's facebook pages to state
			if (res.data) {
				this.props.getUserAccounts();
			}
		});
	}
	render() {
		// Initialize
		var accounts = this.props.accounts;
		var connectedFacebookAccounts = [];
		var connectedTwitterAccounts = [];
		var connectedLinkedinAccounts = [];
		var connectedAccountsHeader;
		var connectedAccountsFooter;

		for (var index in accounts) {
			// Initialize
			var account = accounts[index];
			// Capitolize first and last name
			var name;
			if (account.givenName) name = account.givenName.charAt(0).toUpperCase() + account.givenName.slice(1);
			if (account.familyName) {
				name += " " + account.familyName.charAt(0).toUpperCase() + account.familyName.slice(1);
			}
			// Header for connected accounts
			connectedAccountsHeader = (
				<h2
					className="center"
					style={{
						color: "var(--black-theme-color)",
						width: "90%",
						borderBottom: " 2px solid var(--purple-theme-color)"
					}}
				>
					Connected Accounts
				</h2>
			);
			connectedAccountsFooter = <hr className="connected-accounts-div-footer" />;
			// Create div for each connected account
			if (account.socialType === "facebook") {
				connectedFacebookAccounts.push(
					<div
						key={connectedFacebookAccounts.length}
						className="connected-social-div center"
						style={{
							borderLeft: "4px solid #4267b2",
							paddingLeft: "10px"
						}}
					>
						<h4>{name}</h4>
						<p>
							{account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
							<button
								id={index}
								className="fa fa-trash"
								style={{
									float: "right",
									color: "red",
									background: "none"
								}}
								onClick={event => this.confirmDelete(event)}
							/>
						</p>
					</div>
				);
			} else if (account.socialType === "twitter") {
				connectedTwitterAccounts.push(
					<div
						key={connectedTwitterAccounts.length}
						className="connected-social-div center"
						style={{
							borderLeft: "4px solid #1da1f2",
							paddingLeft: "10px"
						}}
					>
						<h4>{name}</h4>
						<p>
							{account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
							<button
								id={index}
								className="fa fa-trash"
								style={{
									float: "right",
									color: "red",
									background: "none"
								}}
								onClick={event => this.confirmDelete(event)}
							/>
						</p>
					</div>
				);
			} else if (account.socialType === "linkedin") {
				connectedLinkedinAccounts.push(
					<div
						key={index}
						className="connected-social-div center"
						style={{
							borderLeft: "4px solid #0077b5",
							paddingLeft: "10px"
						}}
					>
						<h4>{name}</h4>
						<p>
							{account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
							<button
								id={connectedLinkedinAccounts.length}
								className="fa fa-trash"
								style={{
									float: "right",
									color: "red",
									background: "none"
								}}
								onClick={this.confirmDelete}
							/>
						</p>
					</div>
				);
			}
		}
		return (
			<div>
				{connectedAccountsHeader}
				{connectedFacebookAccounts}
				{connectedTwitterAccounts}
				{connectedLinkedinAccounts}
				{connectedAccountsFooter}
			</div>
		);
	}
}

export default ConnectedAccountsList;
