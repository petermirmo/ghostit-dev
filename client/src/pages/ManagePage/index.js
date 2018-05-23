import React, { Component } from "react";

import UsersTable from "./UsersTable";
import PlansTable from "./PlansTable";
import { roleCheck } from "../../extra/functions/CommonFunctions";
import "./style.css";

class ManagePage extends Component {
	state = {
		userTable: true
	};
	constructor(props) {
		super(props);

		// Make sure user is an admin!
		roleCheck();
		this.switchDivs = this.switchDivs.bind(this);
	}
	switchDivs(event) {
		this.setState({ userTable: !this.state.userTable });
	}
	render() {
		return (
			<div id="wrapper">
				<div className="switch center">
					{!this.state.userTable && (
						<button className="switch-button active-switch" onClick={event => this.switchDivs(event)}>
							Edit Users
						</button>
					)}
					{this.state.userTable && (
						<button className="switch-button active-switch" onClick={event => this.switchDivs(event)}>
							Edit Plans
						</button>
					)}
				</div>
				{this.state.userTable ? <UsersTable /> : <PlansTable />}
			</div>
		);
	}
}

export default ManagePage;
