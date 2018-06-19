import React, { Component } from "react";
import "./styles/";

class ManageColumn extends Component {
	render() {
		const { objectList, handleClickedObject, searchObjects, styleOverride } = this.props;
		let objectListDivs = [];

		// User list is sent by parent in props
		// Loop through and create a row for each user
		for (let index in objectList) {
			let name = objectList[index]._id;
			if (objectList[index].name) name = objectList[index].name;
			if (objectList[index].fullName) name = objectList[index].fullName;
			if (objectList[index].title) name = objectList[index].title;
			if (objectList[index].notes) name = objectList[index].notes;

			objectListDivs.push(
				<p id={index} key={index} className="user-row center" onClick={handleClickedObject}>
					{name}
				</p>
			);
		}
		return (
			<div className="user-column" style={styleOverride}>
				<textarea onKeyUp={searchObjects} placeholder="Search" className="search center" rows={1} />
				{objectListDivs}
			</div>
		);
	}
}
export default ManageColumn;
