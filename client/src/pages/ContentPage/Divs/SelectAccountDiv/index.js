import React, { Component } from "react";

import "./styles/";

class SelectAccountDiv extends Component {
	render() {
		let accountsListDiv = [];
		const { activePageAccountsArray, activeAccount, setActiveAccount, canEdit } = this.props;
		// To select which account to post to
		for (let index in activePageAccountsArray) {
			let name;
			let account = activePageAccountsArray[index];

			if (account.givenName) name = account.givenName.charAt(0).toUpperCase() + account.givenName.slice(1);
			if (account.familyName) name += " " + account.familyName.charAt(0).toUpperCase() + account.familyName.slice(1);
			if (account.username) name = account.username;

			let className = "account-container";

			if (activeAccount === String(account._id)) {
				className += " common-active";
			}
			// Push div to array

			accountsListDiv.push(
				<div className={className} onClick={event => setActiveAccount(account)} key={index}>
					<div className={"account-icon fa fa-" + account.socialType + " " + account.socialType} />
					<div className="account-title-type-container">
						<div className="account-name">{name}</div>
						<div className="account-type">{account.accountType}</div>
					</div>
				</div>
			);
		}
		return (
			<div className="select-accounts-container">
				{canEdit && <h4 className="select-accounts-header">Choose an account to post to!</h4>}
				<div className="accounts-container">{accountsListDiv}</div>
			</div>
		);
	}
}
export default SelectAccountDiv;
