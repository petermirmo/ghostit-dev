import React, { Component } from "react";
import "./style.css";

class NavBar extends Component {
	render() {
		var categoryDivs = [];
		let active;
		for (var index in this.props.categories) {
			if (this.props.categories[index] === this.props.setActive) {
				active = "active";
			} else {
				active = "";
			}
			categoryDivs.push(
				<li key={index} onClick={this.props.updateParentState}>
					<a id={this.props.categories[index]} className={active}>
						{this.props.categories[index]}
					</a>
				</li>
			);
		}
		return <ul>{categoryDivs}</ul>;
	}
}

export default NavBar;
