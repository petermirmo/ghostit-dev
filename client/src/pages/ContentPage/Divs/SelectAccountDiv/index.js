import React, { Component } from "react";
import "./style.css";

class SelectAccountDiv extends Component {
	render() {
		let accountsListDiv = [];
		const { activePageAccountsArray, activeAccount, setActiveAccount } = this.props;
		// To select which account to post to
		for (let index in activePageAccountsArray) {
			let name;
			let account = activePageAccountsArray[index];

			if (account.givenName) name = account.givenName.charAt(0).toUpperCase() + account.givenName.slice(1);
			if (account.familyName) name += " " + account.familyName.charAt(0).toUpperCase() + account.familyName.slice(1);
			if (account.username) name = account.username;

			let className = "select-accounts-posting-div";

			if (activeAccount === String(account._id)) {
				className += " common-active";
			}
			// Push div to array
			let div = (
				<div key={index} className={className} onClick={event => setActiveAccount(account)}>
					<h4>{name}</h4>
					<p>{account.accountType}</p>
				</div>
			);
			accountsListDiv.push(div);
		}
		return (
			<div className="center select-accounts-container">
				<h4 className="select-accounts-header">Choose an account to post to!</h4>
				{accountsListDiv}
			</div>
		);
	}
}
export default SelectAccountDiv;
