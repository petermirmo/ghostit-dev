import React, { Component } from "react";

class ContentModalHeader extends Component {
	render() {
		const { categories, switchTabs, activeTab } = this.props;
		let categoryDivs = [];
		for (let index in categories) {
			categoryDivs.push(
				<div
					className={activeTab === categories[index] ? "account-tab active-account-tab" : "account-tab"}
					key={index}
					onClick={this.props.updateParentState}
				>
					<button onClick={event => switchTabs(categories[index])}>
						{categories[index].charAt(0).toUpperCase()}
						{categories[index].slice(1)}
					</button>
				</div>
			);
		}
		return <div className="row content-header">{categoryDivs}</div>;
	}
}

export default ContentModalHeader;
