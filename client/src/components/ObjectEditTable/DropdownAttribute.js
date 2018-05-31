import React, { Component } from "react";

class DropDownAttribute extends Component {
	state = {
		showDropdown: false,
		dropdownList: this.props.dropdownList,
		untouchedDropdownList: this.props.dropdownList,
		inputValue: this.props.value
	};

	componentDidMount() {
		document.addEventListener("mousedown", this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
	}
	setWrapperRef = node => {
		this.wrapperRef = node;
	};

	handleClickOutside = event => {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.setState({ showDropdown: false });
		}
	};
	showDropDownList = event => {
		this.setState({ showDropdown: true });
	};
	sortDropdown = event => {
		let { untouchedDropdownList } = this.state;
		let dropdownList = [];

		for (let index in untouchedDropdownList) {
			// Check to see if index is an object or not
			let indexValue;
			if (untouchedDropdownList[index].name) {
				indexValue = untouchedDropdownList[index].name;
			} else {
				indexValue = untouchedDropdownList[index];
			}
			if (indexValue.includes(event.target.value)) {
				dropdownList.push(indexValue);
			}
		}
		this.setState({ inputValue: event.target.value, dropdownList: dropdownList });
	};
	updateDropdown = (index, value, id) => {
		this.setState({ showDropdown: false, inputValue: value });

		// event.target.id is the id of the writer while event.target.innerhtml is the name of the writer
		this.props.updateParentState(index, value, id);
	};
	render() {
		let dropDownContent = [];
		let { dropdownList, showDropdown, inputValue } = this.state;
		let { label } = this.props;

		for (let index in dropdownList) {
			if (dropdownList[index].id) {
				dropDownContent.push(
					<p
						id={dropdownList[index].id}
						key={index}
						onClick={event => this.updateDropdown(label, event.target.innerHTML, event.target.id)}
					>
						{dropdownList[index].value ? dropdownList[index].value : dropdownList[index].id}
					</p>
				);
			} else {
				dropDownContent.push(
					<p id={dropdownList[index]} key={index} onClick={event => this.updateDropdown(label, dropdownList[index])}>
						{dropdownList[index]}
					</p>
				);
			}
		}
		return (
			<div className="row" ref={this.setWrapperRef}>
				<span className="user-attribute-label">
					<h4>{label + ":"}</h4>
					<div className="user-attribute-dropdown">
						<input
							className="user-attribute-dropdown-input"
							onChange={this.sortDropdown}
							onClick={this.showDropDownList}
							value={inputValue}
						/>
						{showDropdown && <div className="dropdown-list center">{dropDownContent}</div>}
					</div>
				</span>
			</div>
		);
	}
}
export default DropDownAttribute;
