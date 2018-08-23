import React, { Component } from "react";
import "./styles/";

class ManageColumn extends Component {
	constructor(props) {
		super(props);
		this.state = this.createState(props);
	}
	createState = props => {
		return {
			untouchedObjects: props.objectList,
			activeObjects: props.objectList
		};
	};
	componentWillReceiveProps(props) {
		this.setState(this.createState(props));
	}

	searchObjects = (event, eventIndex, eventIndex2) => {
		let value = event.target.value;
		let { untouchedObjects } = this.state;
		if (value === "") {
			this.setState({ activeUsers: untouchedObjects });
			return;
		}
		let stringArray = value.split(" ");

		let activeObjects = [];
		// Loop through all objects
		for (let index in untouchedObjects) {
			let matchFound = false;
			// Loop through all words in the entered value
			for (let j in stringArray) {
				// Make sure we are not checking an empty string
				if (stringArray[j] !== "") {
					// Check to see if a part of the string matches object's index or index2
					if (untouchedObjects[index][eventIndex]) {
						if (untouchedObjects[index][eventIndex].includes(stringArray[j])) {
							matchFound = true;
						}
					}
					if (untouchedObjects[index][eventIndex2]) {
						if (untouchedObjects[index][eventIndex2].includes(stringArray[j])) {
							matchFound = true;
						}
					}
				}
			}
			if (matchFound) {
				activeObjects.push(untouchedObjects[index]);
			}
		}
		this.setState({ activeObjects });
	};
	render() {
		const { handleClickedObject, styleOverride, indexSearch, indexSearch2 } = this.props;

		let { activeObjects } = this.state;

		let activeObjectsDivs = [];

		// User list is sent by parent in props
		// Loop through and create a row for each user
		for (let index in activeObjects) {
			let name = activeObjects[index]._id;
			if (activeObjects[index].name) name = activeObjects[index].name;
			if (activeObjects[index].fullName) name = activeObjects[index].fullName;
			if (activeObjects[index].title) name = activeObjects[index].title;
			if (activeObjects[index].notes) name = activeObjects[index].notes;

			activeObjectsDivs.push(
				<div key={index} className="user-row" onClick={() => handleClickedObject(activeObjects[index])}>
					{name}
				</div>
			);
		}
		return (
			<div className="user-column" style={styleOverride}>
				<textarea
					onKeyUp={e => this.searchObjects(e, indexSearch, indexSearch2)}
					placeholder="Search"
					className="search"
					rows={1}
				/>
				{activeObjectsDivs}
			</div>
		);
	}
}
export default ManageColumn;
