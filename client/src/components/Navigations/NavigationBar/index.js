import React, { Component } from "react";
import "./style.css";

class NavBar extends Component {
	render() {
		const { categories } = this.props;
		let categoryDivs = [];
		for (let index in categories) {
			if (!index) break;
			categoryDivs.push(
				<li className="navigation-option-container" key={index} onClick={this.props.updateParentState}>
					<a className={categories[index] ? "nagivation-option active" : "nagivation-option"} id={index}>
						{index}
					</a>
				</li>
			);
		}
		return <ul className="navigation-container center">{categoryDivs}</ul>;
	}
}

export default NavBar;
