import React, { Component } from "react";

class ContentModalHeader extends Component {
	render() {
		const { categories, switchTabs, activeTab } = this.props;
		let categoryDivs = [];
		for (let index in categories) {
			categoryDivs.push(
				<div
					className={activeTab.name === categories[index].name ? "account-tab active-account-tab" : "account-tab"}
					key={index}
					onClick={event => switchTabs(categories[index])}
				>
					{categories[index].name.charAt(0).toUpperCase()}
					{categories[index].name.slice(1)}
				</div>
			);
		}
		return <div className="post-modal-header">{categoryDivs}</div>;
	}
}

export default ContentModalHeader;
