import React, { Component } from "react";
import axios from "axios";

import SocialMediaDiv from "./SocialMediaDiv";
import "./style.css";

class AddPagesOrGroupsModal extends Component {
	state = {
		pagesToAdd: []
	};

	setPagesToAdd = pagesToAdd => {
		this.setState({
			pagesToAdd: pagesToAdd
		});
	};
	addAccounts = () => {
		const { pagesToAdd } = this.state;
		if (pagesToAdd.length === 0 || !pagesToAdd) {
			alert("You have not selected any pages to add!");
		} else {
			for (let index in pagesToAdd) {
				let page = pagesToAdd[index];
				// Add accountType and socialType
				page.accountType = this.props.accountType;
				page.socialType = this.props.socialType;
				axios.post("/api/account", page).then(res => {
					// Check to see if accounts were successfully saved
					if (res.data) {
						this.props.getUserAccounts();
					} else {
						alert("Account already added");
					}
				});
			}
			this.props.close();
			this.props.getUserAccounts();
		}
	};

	render() {
		const { socialType, accountType, pageOrGroup, errorMessage } = this.props;

		return (
			<div className="modal">
				<div className="modal-content" style={{ textAlign: "center", width: "35%" }}>
					<div className={socialType + " modal-header"}>
						<span className="close" onClick={() => this.props.close()}>
							&times;
						</span>
						<h2 className="connect-header">
							Connect {socialType.charAt(0).toUpperCase() + socialType.slice(1)}{" "}
							{accountType.charAt(0).toUpperCase() + accountType.slice(1)}
						</h2>
					</div>

					<div className="modal-body">
						<SocialMediaDiv updateParentAccounts={this.setPagesToAdd} accounts={pageOrGroup} message={errorMessage} />
					</div>

					{pageOrGroup.length !== 0 && (
						<div className="modal-footer">
							<button className={socialType + " connect-social-media"} onClick={() => this.addAccounts()}>
								Connect
							</button>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default AddPagesOrGroupsModal;
