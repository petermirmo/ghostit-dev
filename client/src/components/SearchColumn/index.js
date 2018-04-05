import React, { Component } from "react";
import "./style.css";

class ManageColumn extends Component {
	render() {
		const { objectList, handleClickedObject, searchObjects, styleOverride } = this.props;
		var userDiv = [];

		// User list is sent by parent in props
		// Loop through and create a row for each user
		for (var index in objectList) {
			let name = objectList[index].name ? objectList[index].name : objectList[index].fullName;
			userDiv.push(
				<p id={index} key={index} className="user-row center" onClick={handleClickedObject}>
					{name}
				</p>
			);
		}
		return (
			<div className="user-column" style={styleOverride}>
				<textarea onKeyUp={searchObjects} placeholder="Search" className="search center" rows={1} />
				{userDiv}
			</div>
		);
	}
}
export default ManageColumn;
