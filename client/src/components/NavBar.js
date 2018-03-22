import React, { Component } from "react";

class NavBar extends Component {
	render() {
		var categoryDivs = [];
		for (var index in this.props.categories) {
			categoryDivs.push(
				<li key={index} onClick={this.props.updateParentState}>
					<a id={this.props.categories[index]}>{this.props.categories[index]}</a>
				</li>
			);
		}
		return <ul>{categoryDivs}</ul>;
	}
}

export default NavBar;
