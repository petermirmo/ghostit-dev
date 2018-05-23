import React, { Component } from "react";

class socialMediaDiv extends Component {
	state = {
		pagesToAdd: [],
		activeDivs: []
	};
	//  For social media background color change on click
	handleParentClick = indexOfAccount => {
		const { accounts } = this.props;
		let { pagesToAdd, activeDivs } = this.state;
		let temp = activeDivs;
		// Check if object is in state array
		if (!pagesToAdd.includes(accounts[indexOfAccount])) {
			// Page index is not in array
			pagesToAdd.push(accounts[indexOfAccount]);
			temp[indexOfAccount] = true;
		} else {
			// Page index is in array so remove it
			let index = pagesToAdd.indexOf(accounts[indexOfAccount]);
			pagesToAdd.splice(index, 1);
			temp[indexOfAccount] = false;
		}
		this.setState({ activeDivs: temp });
		this.props.updateParentAccounts(pagesToAdd);
	};

	render() {
		const { message, accounts } = this.props;
		const { activeDivs } = this.state;

		// Error message
		let pagesMessage = <p>{message}</p>;

		let accountsDiv = [];

		for (let index in accounts) {
			let page = accounts[index];
			pagesMessage = null;
			let className = "social-media-div";
			if (activeDivs[index]) {
				className += " social-media-div-clicked";
			}

			// This creates a div for each page that can be clicked
			// by the user to save these pages to our database
			accountsDiv.push(
				<div key={index} className={className} onClick={event => this.handleParentClick(index)}>
					<h4>{page.name}</h4>
					<p>{page.category}</p>
				</div>
			);
		}
		console.log(activeDivs);
		return (
			<div>
				{pagesMessage}
				{accountsDiv}
			</div>
		);
	}
}

export default socialMediaDiv;
