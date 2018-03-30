import React, { Component } from "react";

class SelectAccountDiv extends Component {
	render() {
		var accountsListDiv = [];

		// To select which account to post to
		for (var index in this.props.activePageAccountsArray) {
			var name =
				this.props.activePageAccountsArray[index].givenName.charAt(0).toUpperCase() +
				this.props.activePageAccountsArray[index].givenName.slice(1);
			if (this.props.activePageAccountsArray[index].familyName) {
				name +=
					" " +
					this.props.activePageAccountsArray[index].familyName.charAt(0).toUpperCase() +
					this.props.activePageAccountsArray[index].familyName.slice(1);
			}
			// Push div to array
			var div = (
				<div
					id={this.props.activePageAccountsArray[index]._id}
					key={index}
					className="connected-accounts-posting-div"
					onClick={event => this.props.postingAccountNav(event)}
				>
					<h4>{name}</h4>
					<p>{this.props.activePageAccountsArray[index].accountType}</p>
				</div>
			);
			accountsListDiv.push(div);
		}
		return <div className="connected-accounts-container center">{accountsListDiv}</div>;
	}
}
export default SelectAccountDiv;
