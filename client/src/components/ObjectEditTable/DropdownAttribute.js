import React, { Component } from "react";

class DropDownAttribute extends Component {
	state = {
		showDropdown: false,
		dropdownList: this.props.dropdownList,
		untouchedDropdownList: this.props.dropdownList,
		inputValue: this.props.value
	};
	constructor(props) {
		super(props);

		this.showDropDownList = this.showDropDownList.bind(this);
		this.sortDropdown = this.sortDropdown.bind(this);
		this.updateDropdown = this.updateDropdown.bind(this);
	}
	showDropDownList(event) {
		this.setState({ showDropdown: !this.state.showDropdown });
	}
	sortDropdown(event) {
		let dropdownList = [];
		for (let index in this.state.untouchedDropdownList) {
			// Check to see if index is an object or not
			let indexValue;
			if (this.state.untouchedDropdownList[index].name) {
				indexValue = this.state.untouchedDropdownList[index].name;
			} else {
				indexValue = this.state.untouchedDropdownList[index];
			}
			if (indexValue.includes(event.target.value)) {
				dropdownList.push(indexValue);
			}
		}
		this.setState({ inputValue: event.target.value, dropdownList: dropdownList });
	}
	updateDropdown(index, value, id) {
		this.setState({ showDropdown: false, inputValue: value });

		// event.target.id is the id of the writer while event.target.innerhtml is the name of the writer
		this.props.updateParentState(index, value, id);
	}
	render() {
		let dropDownContent = [];
		for (var index in this.state.dropdownList) {
			if (this.state.dropdownList[index].id) {
				dropDownContent.push(
					<p
						id={this.state.dropdownList[index].id}
						key={index}
						onClick={event => this.updateDropdown(this.props.label, event.target.innerHTML, event.target.id)}
					>
						{this.state.dropdownList[index].value}
					</p>
				);
			} else {
				dropDownContent.push(
					<p
						id={this.state.dropdownList[index]}
						key={index}
						onClick={event => this.updateDropdown(this.props.label, event.target.innerHTML)}
					>
						{this.state.dropdownList[index]}
					</p>
				);
			}
		}
		return (
			<div className="row">
				<span className="user-attribute-label">
					<h4>{this.props.label + ":"}</h4>
					<div className="user-attribute-dropdown">
						<input
							className="user-attribute-dropdown-input"
							onChange={this.sortDropdown}
							onClick={this.showDropDownList}
							value={this.state.inputValue}
						/>
						{this.state.showDropdown && <div className="dropdown-list center">{dropDownContent}</div>}
					</div>
				</span>
			</div>
		);
	}
}
export default DropDownAttribute;
