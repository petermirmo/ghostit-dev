import React, { Component } from "react";
import "./style.css";

class NavBar extends Component {
	render() {
		const { categories } = this.props;
		var categoryDivs = [];
		for (var index in categories) {
			categoryDivs.push(
				<li className="navigation-container" key={index} onClick={this.props.updateParentState}>
					<a
						className={this.props.setActive === categories[index] ? "nagivation-option active" : "nagivation-option"}
						id={categories[index]}
					>
						{categories[index]}
					</a>
				</li>
			);
		}
		return <ul>{categoryDivs}</ul>;
	}
}

export default NavBar;
