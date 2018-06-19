import React, { Component } from "react";
import "./styles/";

class NavBar extends Component {
	render() {
		const { categories } = this.props;
		let categoryDivs = [];
		for (let index in categories) {
			if (!index) break;
			categoryDivs.push(
				<div className="navigation-option-container" key={index} onClick={this.props.updateParentState}>
					<div className={categories[index] ? "nagivation-option active" : "nagivation-option"} id={index}>
						{index}
					</div>
				</div>
			);
		}
		return <ul className="navigation-container">{categoryDivs}</ul>;
	}
}

export default NavBar;
