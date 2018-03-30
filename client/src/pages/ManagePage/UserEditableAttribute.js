import React, { Component } from "react";

class UserEdittableAttribute extends Component {
	render() {
		return (
			<div className="row">
				<span className="user-attribute-label">
					<h4>{this.props.label + ":"}</h4>
					<textarea
						className="user-attribute-edit"
						rows={1}
						defaultValue={this.props.value}
						onChange={event => this.props.updateParentState(this.props.label, event.target.value)}
					/>
				</span>
			</div>
		);
	}
}
export default UserEdittableAttribute;
