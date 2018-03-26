import React, { Component } from "react";

class UserAttribute extends Component {
	constructor(props) {
		super(props);

		this.showDropDownList = this.showDropDownList.bind(this);
		this.dismissDropDownList = this.dismissDropDownList.bind(this);
	}
	showDropDownList(event) {
		if (event.target.parentNode.children[1].style.display === "block")
			event.target.parentNode.children[1].style.display = "none";
		else event.target.parentNode.children[1].style.display = "block";
	}
	dismissDropDownList(event) {
		event.target.parentNode.style.display = "none";
		this.props.updateParentState(this.props.label, event.target.id, event.target.innerHTML);
	}

	render() {
		let userAttributeDiv;
		if (this.props.editUser) {
			if (this.props.dropdown) {
				// Dropdown
				let dropDownContent = [];
				for (var index in this.props.dropdownList) {
					if (this.props.dropdownList[index].writer) {
						dropDownContent.push(
							<p id={this.props.dropdownList[index]._id} key={index} onClick={this.dismissDropDownList}>
								{this.props.dropdownList[index].fullName}
							</p>
						);
					} else {
						dropDownContent.push(
							<p id={this.props.dropdownList[index]} key={index} onClick={this.dismissDropDownList}>
								{this.props.dropdownList[index]}
							</p>
						);
					}
				}
				let dropDownList = <div className="dropdown-list center">{dropDownContent}</div>;
				userAttributeDiv = (
					<div className="user-attribute-dropdown center">
						<button className="user-attribute-dropdown-button" onClick={this.showDropDownList}>
							{this.props.value}
						</button>
						{dropDownList}
					</div>
				);
			} else {
				// Edit textarea

				userAttributeDiv = (
					<span id="test" className="center">
						<textarea
							className="user-attribute-edit"
							rows={1}
							defaultValue={this.props.value}
							onChange={event => this.props.updateParentState(this.props.label, event.target.value)}
						/>
					</span>
				);
			}
		} else {
			// Not editting
			userAttributeDiv = <p className="user-attribute">{this.props.value}</p>;
		}
		return (
			<div style={{ overflow: "hidden" }}>
				<h4 className="user-attribute-label">{this.props.label + ":"}</h4>
				{userAttributeDiv}
			</div>
		);
	}
}
export default UserAttribute;
