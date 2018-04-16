import React, { Component } from "react";
import axios from "axios";
import SocialMediaDiv from "./SocialMediaDiv";

class addPagesOrGroupsModal extends Component {
	constructor(props) {
		super(props);

		this.updateParentState = this.updateParentState.bind(this);
	}
	closeModal() {
		this.props.close();

		// Remove active class from all divs
		for (var index in this.props.pageOrGroup) {
			var pageDiv = document.getElementById(index);
			pageDiv.className = "social-media-div";
		}
	}
	updateParentState(pagesToAdd) {
		this.setState({
			pagesToAdd: pagesToAdd
		});
	}
	addAccounts() {
		var pagesToAdd = this.state.pagesToAdd;
		if (pagesToAdd.length === 0 || !pagesToAdd) {
			alert("You have not selected any pages to add!");
		} else {
			for (var index in pagesToAdd) {
				var page = pagesToAdd[index];
				// Add accountType and socialType
				page.accountType = this.props.accountType;
				page.socialType = this.props.socialType;
				axios.post("/api/account", page).then(res => {
					// Check to see if accounts were successfully saved
					var success = res.data;
					if (success) {
						this.props.getUserAccounts();
					} else {
						alert("Account already added");
					}
				});
			}
			this.closeModal();
			this.props.getUserAccounts();
		}
	}

	render() {
		return (
			<div id="addPagesOrGroupsModal" className="modal">
				<div className="modal-content" style={{ textAlign: "center", width: "35%" }}>
					<div className="facebook modal-header">
						<span className="close" onClick={() => this.closeModal()}>
							&times;
						</span>
						<h2>
							Connect {this.props.socialType} {this.props.accountType}
						</h2>
					</div>

					<div className="modal-body">
						<SocialMediaDiv
							updateParentAccounts={this.updateParentState}
							accounts={this.props.pageOrGroup}
							message={this.props.errorMessage}
						/>
					</div>

					<div className="modal-footer">
						<button className="facebook" onClick={() => this.addAccounts()}>
							Connect
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default addPagesOrGroupsModal;
